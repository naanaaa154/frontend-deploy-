import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { swal } from "~/lib/swal";
import { authFetch, authJson } from "~/lib/api-client";
import {
    FileText,
    Calendar,
    Users,
    Tag,
    X,
    Search,
    Upload,
    ChevronRight,
    Clock,
    Trash2,
    Filter,
    SortDesc
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type TranscriptListItem = {
    id: string;
    agenda: string;
    date: string;
    main_topic?: string[] | null;
    participants?: string[] | null;
};

type TranscriptDetail = TranscriptListItem & {
    transcripts: string;
};

export default function TranscriptListPage() {
    const [transcripts, setTranscripts] = useState<TranscriptListItem[]>([]);
    const [filteredTranscripts, setFilteredTranscripts] = useState<TranscriptListItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedTranscript, setSelectedTranscript] = useState<TranscriptDetail | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTranscripts = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const data = await authJson<TranscriptListItem[]>(`${API_BASE_URL}/api/transcripts`);
                setTranscripts(data ?? []);
                setFilteredTranscripts(data ?? []);
            } catch (error: any) {
                setErrorMessage(error?.message || "Terjadi kesalahan saat memuat transkrip.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTranscripts();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredTranscripts(transcripts);
        } else {
            const filtered = transcripts.filter(
                (t) =>
                    t.agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.main_topic?.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    t.participants?.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredTranscripts(filtered);
        }
    }, [searchQuery, transcripts]);

    const handleView = async (transcriptId: string) => {
        setIsModalOpen(true);
        setIsDetailLoading(true);
        setSelectedTranscript(null);
        setErrorMessage(null);
        try {
            const data = await authJson<TranscriptDetail>(`${API_BASE_URL}/api/transcripts/${transcriptId}`);
            setSelectedTranscript(data);
        } catch (error: any) {
            setErrorMessage(error?.message || "Terjadi kesalahan saat memuat detail transkrip.");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTranscript(null);
        setErrorMessage(null);
    };

    const handleDelete = async (transcriptId: string) => {
        if (deletingId) return;
        const result = await swal.fire({
            title: "Hapus transkrip ini?",
            text: "Semua embedding terkait juga akan dihapus.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        setDeletingId(transcriptId);
        setErrorMessage(null);
        try {
            const res = await authFetch(`${API_BASE_URL}/api/transcripts/${transcriptId}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.detail || res.statusText || "Gagal menghapus transkrip.");
            }

            setTranscripts((prev) => prev.filter((t) => t.id !== transcriptId));
            if (selectedTranscript?.id === transcriptId) {
                closeModal();
            }
            await swal.fire({
                icon: "success",
                title: "Transkrip dihapus",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error: any) {
            const message = error?.message || "Terjadi kesalahan saat menghapus transkrip.";
            setErrorMessage(message);
            await swal.fire({
                icon: "error",
                title: "Gagal menghapus",
                text: message,
            });
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const getRelativeTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return "Hari ini";
            if (diffDays === 1) return "Kemarin";
            if (diffDays < 7) return `${diffDays} hari lalu`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
            if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
            return `${Math.floor(diffDays / 365)} tahun lalu`;
        } catch {
            return "";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#034391] to-[#0256b8] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/30">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    Daftar Transkrip
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Kelola dan lihat semua transkrip rapat Anda
                                </p>
                            </div>
                        </div>
                        <Link to="/dashboard/transcripts/upload">
                            <Button size="lg" className="w-full lg:w-auto bg-gradient-to-r from-[#034391] to-[#0256b8] hover:from-[#023068] hover:to-[#034391] text-white shadow-lg hover:shadow-xl shadow-blue-900/30 hover:shadow-blue-900/40 transition-all duration-200">
                                <Upload className="w-5 h-5 mr-2" />
                                Upload Transkrip
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search & Filter Bar */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan agenda, topik, atau peserta..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#034391] dark:focus:ring-[#0256b8] shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    {!isLoading && !errorMessage && (
                        <div className="flex items-center justify-between text-sm">
                            <p className="text-gray-600 dark:text-gray-400">
                                {searchQuery ? (
                                    <>
                                        Ditemukan <span className="font-semibold text-gray-900 dark:text-white">{filteredTranscripts.length}</span> dari {transcripts.length} transkrip
                                    </>
                                ) : (
                                    <>
                                        Total <span className="font-semibold text-gray-900 dark:text-white">{transcripts.length}</span> transkrip
                                    </>
                                )}
                            </p>
                        </div>
                    )}
                </div>

                {/* Content */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-[#034391] border-t-transparent rounded-full animate-spin absolute top-0"></div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-6">Memuat transkrip...</p>
                    </div>
                )}

                {!isLoading && errorMessage && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-6">
                            <X className="w-10 h-10 text-red-500" />
                        </div>
                        <p className="text-red-500 text-center max-w-md">{errorMessage}</p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => window.location.reload()}
                        >
                            Coba Lagi
                        </Button>
                    </div>
                )}

                {!isLoading && !errorMessage && filteredTranscripts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                            <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {searchQuery ? "Tidak Ada Hasil" : "Belum Ada Transkrip"}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                            {searchQuery
                                ? "Tidak ada transkrip yang sesuai dengan pencarian Anda. Coba kata kunci lain."
                                : "Mulai dengan mengupload transkrip rapat pertama Anda."}
                        </p>
                        {!searchQuery && (
                            <Link to="/dashboard/transcripts/upload">
                                <Button className="bg-gradient-to-r from-[#034391] to-[#0256b8] hover:from-[#023068] hover:to-[#034391] shadow-md">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Transkrip Pertama
                                </Button>
                            </Link>
                        )}
                    </div>
                )}

                {!isLoading && !errorMessage && filteredTranscripts.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTranscripts.map((transcript) => (
                            <div
                                key={transcript.id}
                                onClick={() => handleView(transcript.id)}
                                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 dark:hover:shadow-blue-900/20 hover:-translate-y-1 shadow-sm"
                            >
                                {/* Date Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                                        <Clock className="w-3.5 h-3.5" />
                                        {getRelativeTime(transcript.date)}
                                    </span>
                                </div>

                                {/* Title */}
                                <div className="mb-4 pr-20">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-[#034391] dark:group-hover:text-[#0256b8] transition-colors">
                                        {transcript.agenda}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(transcript.date)}</span>
                                    </div>
                                </div>

                                {/* Topics */}
                                {transcript.main_topic && transcript.main_topic.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                            <Tag className="w-3.5 h-3.5" />
                                            Topik
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {transcript.main_topic.slice(0, 3).map((topic, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-950/30 text-[#034391] dark:text-[#60a5fa] rounded-lg text-xs font-medium"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                            {transcript.main_topic.length > 3 && (
                                                <span className="inline-flex items-center px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium">
                                                    +{transcript.main_topic.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Participants */}
                                {transcript.participants && transcript.participants.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                            <Users className="w-3.5 h-3.5" />
                                            Peserta
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {transcript.participants.slice(0, 3).map((participant, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium"
                                                >
                                                    {participant}
                                                </span>
                                            ))}
                                            {transcript.participants.length > 3 && (
                                                <span className="inline-flex items-center px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium">
                                                    +{transcript.participants.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* View Button */}
                                <div className="flex items-center justify-between pt-4">
                                    <span className="text-sm font-medium text-[#034391] dark:text-[#60a5fa] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                        Lihat Detail
                                        <ChevronRight className="w-4 h-4" />
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleDelete(transcript.id);
                                        }}
                                        disabled={deletingId === transcript.id}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
                                        aria-label="Hapus transkrip"
                                        title="Hapus transkrip"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={closeModal}
                >
                    <div
                        className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 via-blue-50/50 to-white dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-800 px-8 py-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                                        {selectedTranscript?.agenda || "Detail Transkrip"}
                                    </h2>
                                    {selectedTranscript?.date && (
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(selectedTranscript.date)}
                                            </span>
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/60 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 backdrop-blur-sm">
                                                <Clock className="w-4 h-4" />
                                                {getRelativeTime(selectedTranscript.date)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={closeModal}
                                    className="flex-shrink-0 hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-xl"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto max-h-[calc(92vh-120px)]">
                            {isDetailLoading && (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                                        <div className="w-16 h-16 border-4 border-[#034391] border-t-transparent rounded-full animate-spin absolute top-0"></div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 mt-6">Memuat detail transkrip...</p>
                                </div>
                            )}

                            {!isDetailLoading && selectedTranscript && (
                                <div className="p-8 space-y-8">
                                    {/* Metadata Grid */}
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Participants */}
                                        {selectedTranscript.participants && selectedTranscript.participants.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                                                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                                                        <Users className="w-4 h-4 text-[#034391] dark:text-[#60a5fa]" />
                                                    </div>
                                                    Peserta Rapat
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedTranscript.participants.map((participant, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium shadow-sm"
                                                        >
                                                            {participant}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Topics */}
                                        {selectedTranscript.main_topic && selectedTranscript.main_topic.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                                                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                                                        <Tag className="w-4 h-4 text-[#034391] dark:text-[#60a5fa]" />
                                                    </div>
                                                    Topik Pembahasan
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedTranscript.main_topic.map((topic, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-950/30 text-[#034391] dark:text-[#60a5fa] rounded-xl text-sm font-medium shadow-sm"
                                                        >
                                                            {topic}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200 dark:border-gray-700"></div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                                            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-[#034391] dark:text-[#60a5fa]" />
                                            </div>
                                            Isi Transkrip
                                        </div>
                                        <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-700/50 p-6 text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto shadow-inner">
                                            {selectedTranscript.transcripts}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isDetailLoading && !selectedTranscript && errorMessage && (
                                <div className="p-20 flex flex-col items-center justify-center">
                                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-6">
                                        <X className="w-10 h-10 text-red-500" />
                                    </div>
                                    <p className="text-red-500 text-center max-w-md">{errorMessage}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}