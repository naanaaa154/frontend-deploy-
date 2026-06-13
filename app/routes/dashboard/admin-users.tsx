import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { authJson } from "~/lib/api-client";
import { useUser } from "~/features/auth";

type AdminUser = {
    id: number;
    username: string;
    email: string;
    role?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
};

type SortField = "username" | "email" | "role" | "status" | "created_at";
type SortOrder = "asc" | "desc";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const ITEMS_PER_PAGE = 10;

export default function AdminUsersPage() {
    const user = useUser();
    const navigate = useNavigate();

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<Record<number, "user" | "superadmin">>({});
    const [processing, setProcessing] = useState<{ id: number | null; action: "approve" | "reject" | null }>({
        id: null,
        action: null,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "active">("all");
    const [sortField, setSortField] = useState<SortField>("created_at");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; userId: number | null; action: "approve" | "reject" | null }>({
        isOpen: false,
        userId: null,
        action: null,
    });

    const isSuperAdmin = user?.role === "superadmin";

    const loadUsers = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await authJson<AdminUser[]>(`${API_BASE_URL}/api/users/`);
            const rows = data || [];
            setUsers(rows);
            const roleMap: Record<number, "user" | "superadmin"> = {};
            rows.forEach((u) => {
                roleMap[u.id] = u.role === "superadmin" ? "superadmin" : "user";
            });
            setSelectedRoles(roleMap);
            setCurrentPage(1);
        } catch (e: any) {
            setError(e?.message || "Gagal memuat daftar user.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        if (!isSuperAdmin) {
            navigate("/dashboard");
            return;
        }
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isSuperAdmin]);

    const activateUser = async (userId: number) => {
        setProcessing({ id: userId, action: "approve" });
        setError(null);
        setSuccess(null);
        try {
            const selectedRole = selectedRoles[userId] || "user";
            await authJson<AdminUser>(`${API_BASE_URL}/api/users/${userId}/activate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: selectedRole }),
            });
            setSuccess(`User berhasil disetujui dengan role ${selectedRole}.`);
            setConfirmDialog({ isOpen: false, userId: null, action: null });
            await loadUsers();
        } catch (e: any) {
            setError(e?.message || "Gagal mengaktifkan user.");
        } finally {
            setProcessing({ id: null, action: null });
        }
    };

    const rejectUser = async (userId: number) => {
        setProcessing({ id: userId, action: "reject" });
        setError(null);
        setSuccess(null);
        try {
            const selectedRole = selectedRoles[userId] || "user";

            // keep selected role change if admin edited it before reject
            await authJson<AdminUser>(`${API_BASE_URL}/api/users/${userId}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: selectedRole }),
            });

            await authJson<AdminUser>(`${API_BASE_URL}/api/users/${userId}/reject`, {
                method: "POST",
            });

            setSuccess("User berhasil ditolak.");
            setConfirmDialog({ isOpen: false, userId: null, action: null });
            await loadUsers();
        } catch (e: any) {
            setError(e?.message || "Gagal menolak user.");
        } finally {
            setProcessing({ id: null, action: null });
        }
    };

    if (!user) {
        return null;
    }

    if (!isSuperAdmin) {
        return null;
    }

    // Filter users
    const filteredUsers = useMemo(() => {
        let result = users;

        // Filter by search term
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (u) =>
                    u.username.toLowerCase().includes(term) ||
                    u.email.toLowerCase().includes(term)
            );
        }

        // Filter by status
        if (filterStatus === "pending") {
            result = result.filter((u) => !u.is_active);
        } else if (filterStatus === "active") {
            result = result.filter((u) => u.is_active);
        }

        return result;
    }, [users, searchTerm, filterStatus]);

    // Sort users
    const sortedUsers = useMemo(() => {
        const sorted = [...filteredUsers];

        sorted.sort((a, b) => {
            let aValue: any = "";
            let bValue: any = "";

            switch (sortField) {
                case "username":
                    aValue = a.username;
                    bValue = b.username;
                    break;
                case "email":
                    aValue = a.email;
                    bValue = b.email;
                    break;
                case "role":
                    aValue = a.role || "user";
                    bValue = b.role || "user";
                    break;
                case "status":
                    aValue = a.is_active ? 1 : 0;
                    bValue = b.is_active ? 1 : 0;
                    break;
                case "created_at":
                    aValue = new Date(a.created_at || 0).getTime();
                    bValue = new Date(b.created_at || 0).getTime();
                    break;
            }

            if (typeof aValue === "string") {
                return sortOrder === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        });

        return sorted;
    }, [filteredUsers, sortField, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedUsers.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedUsers, currentPage]);

    const stats = useMemo(
        () => ({
            total: users.length,
            pending: users.filter((u) => !u.is_active).length,
            active: users.filter((u) => u.is_active).length,
        }),
        [users]
    );

    const handleConfirmAction = (userId: number, action: "approve" | "reject") => {
        setConfirmDialog({ isOpen: true, userId, action });
    };

    const handleExecuteAction = () => {
        if (confirmDialog.userId && confirmDialog.action) {
            if (confirmDialog.action === "approve") {
                activateUser(confirmDialog.userId);
            } else {
                rejectUser(confirmDialog.userId);
            }
        }
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setFilterStatus("all");
        setSortField("created_at");
        setSortOrder("desc");
        setCurrentPage(1);
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Kelola dan setujui user yang baru mendaftar. Halaman ini hanya dapat diakses oleh superadmin.
                </p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-4 rounded-lg bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-3 text-sm border border-green-200 dark:border-green-800 flex items-start justify-between">
                    <span>{success}</span>
                    <button
                        onClick={() => setSuccess(null)}
                        className="ml-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-4 py-3 text-sm border border-red-200 dark:border-red-800 flex items-start justify-between">
                    <span>{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="ml-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 shadow-sm">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium mb-1">Pending Approval</p>
                    <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-400">{stats.pending}</p>
                </div>
                <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 shadow-sm">
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-400">{stats.active}</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan username atau email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="flex-1 rounded-lg bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value as "all" | "pending" | "active");
                            setCurrentPage(1);
                        }}
                        className="rounded-lg bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                    </select>
                    <Button
                        onClick={clearFilters}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4"
                    >
                        Reset Filter
                    </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Menampilkan <span className="font-semibold">{paginatedUsers.length}</span> dari <span className="font-semibold">{filteredUsers.length}</span> user
                </p>
            </div>

            {/* Table */}
            <div className="rounded-xl bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Memuat data user...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 8.048M12 4.354V2m0 2.354a4 4 0 110 8.048m0-8.048v2.354m0-2.354a4 4 0 100 8.048m0-8.048v2.354"
                            />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Belum ada user.</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0-5a2.986 2.986 0 002 2.828m0 0a2.986 2.986 0 002 2.828m0 0v3.172A2 2 0 1015 19m0 0a2 2 0 100-4"
                            />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Tidak ada user yang cocok dengan filter.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900/40">
                                <tr>
                                    <th className="text-left px-4 py-4 text-gray-700 dark:text-gray-200 font-semibold">
                                        <button
                                            onClick={() => handleSort("username")}
                                            className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            Username
                                            {sortField === "username" && (
                                                <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                            )}
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-4 text-gray-700 dark:text-gray-200 font-semibold">
                                        <button
                                            onClick={() => handleSort("email")}
                                            className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            Email
                                            {sortField === "email" && (
                                                <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                            )}
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-4 text-gray-700 dark:text-gray-200 font-semibold">
                                        <button
                                            onClick={() => handleSort("role")}
                                            className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            Role
                                            {sortField === "role" && (
                                                <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                            )}
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-4 text-gray-700 dark:text-gray-200 font-semibold">
                                        <button
                                            onClick={() => handleSort("status")}
                                            className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            Status
                                            {sortField === "status" && (
                                                <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                            )}
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-4 text-gray-700 dark:text-gray-200 font-semibold">
                                        <button
                                            onClick={() => handleSort("created_at")}
                                            className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            Bergabung
                                            {sortField === "created_at" && (
                                                <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                            )}
                                        </button>
                                    </th>
                                    <th className="text-left px-4 py-4 text-gray-700 dark:text-gray-200 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((u) => {
                                    const isPending = !u.is_active;
                                    const formatDate = (dateString?: string) => {
                                        if (!dateString) return "Tidak diketahui";
                                        try {
                                            const date = new Date(dateString);
                                            if (isNaN(date.getTime())) return "Tidak diketahui";
                                            return date.toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            });
                                        } catch {
                                            return "Tidak diketahui";
                                        }
                                    };
                                    const createdDate = formatDate(u.created_at);
                                    return (
                                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100/40 dark:border-gray-700/20 last:border-b-0">
                                            <td className="px-4 py-4 text-gray-900 dark:text-gray-100 font-medium">{u.username}</td>
                                            <td className="px-4 py-4 text-gray-700 dark:text-gray-300 text-xs md:text-sm">{u.email}</td>
                                            <td className="px-4 py-4">
                                                <select
                                                    value={selectedRoles[u.id] || "user"}
                                                    onChange={(e) =>
                                                        setSelectedRoles((prev) => ({
                                                            ...prev,
                                                            [u.id]: e.target.value as "user" | "superadmin",
                                                        }))
                                                    }
                                                    className="rounded-md bg-white dark:bg-gray-700 px-2 py-1 text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    disabled={processing.id === u.id}
                                                >
                                                    <option value="user">user</option>
                                                    <option value="superadmin">superadmin</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-4">
                                                {u.is_active ? (
                                                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                        ✓ Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                                        ◐ Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-gray-600 dark:text-gray-400 text-xs md:text-sm">{createdDate}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    {u.is_active ? (
                                                        <Button
                                                            size="sm"
                                                            disabled={processing.id === u.id}
                                                            onClick={() => handleConfirmAction(u.id, "reject")}
                                                            className="bg-red-600 hover:bg-red-700 text-white text-xs"
                                                        >
                                                            {processing.id === u.id && processing.action === "reject"
                                                                ? "..."
                                                                : "Reject"}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            disabled={processing.id === u.id}
                                                            onClick={() => handleConfirmAction(u.id, "approve")}
                                                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                                        >
                                                            {processing.id === u.id && processing.action === "approve"
                                                                ? "..."
                                                                : "Approve"}
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredUsers.length > ITEMS_PER_PAGE && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="bg-gray-400 hover:bg-gray-500 disabled:opacity-50 text-white"
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="bg-gray-400 hover:bg-gray-500 disabled:opacity-50 text-white"
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {confirmDialog.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {confirmDialog.action === "approve" ? "Setujui User?" : "Tolak User?"}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                {confirmDialog.action === "approve"
                                    ? "Apakah Anda yakin ingin menyetujui user ini dengan role yang dipilih?"
                                    : "Apakah Anda yakin ingin menolak user ini?"}
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    onClick={() => setConfirmDialog({ isOpen: false, userId: null, action: null })}
                                    className="bg-gray-400 hover:bg-gray-500 text-white"
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleExecuteAction}
                                    disabled={processing.id !== null}
                                    className={`text-white ${confirmDialog.action === "approve"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-red-600 hover:bg-red-700"
                                        }`}
                                >
                                    {processing.id !== null ? "Memproses..." : confirmDialog.action === "approve" ? "Setujui" : "Tolak"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
