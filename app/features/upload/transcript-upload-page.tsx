import React, { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { FileUp, Info, Loader2, Plus, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function TranscriptUploadPage() {
    const [agenda, setAgenda] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");
    // dynamic list inputs for participants and main topics (instead of comma-separated text)
    const [participantsList, setParticipantsList] = useState<string[]>([""]);
    const [mainTopicsList, setMainTopicsList] = useState<string[]>([""]);
    const [file, setFile] = useState<File | null>(null);
    const [summaryFile, setSummaryFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const isValid = useMemo(() => {
        const hasParticipants = participantsList.some((p) => p.trim().length > 0);
        const hasMainTopics = mainTopicsList.some((m) => m.trim().length > 0);
        return Boolean(
            file &&
            summaryFile &&
            agenda.trim() &&
            date.trim() &&
            startTime.trim() &&
            endTime.trim() &&
            location.trim() &&
            hasParticipants &&
            hasMainTopics
        );
    }, [file, summaryFile, agenda, date, startTime, endTime, location, participantsList, mainTopicsList]);

    // handlers for dynamic lists
    const updateParticipant = (idx: number, value: string) => {
        setParticipantsList((prev) => prev.map((p, i) => (i === idx ? value : p)));
    };
    const addParticipant = () => setParticipantsList((prev) => [...prev, ""]);
    const removeParticipant = (idx: number) => setParticipantsList((prev) => prev.filter((_, i) => i !== idx));

    const updateMainTopic = (idx: number, value: string) => {
        setMainTopicsList((prev) => prev.map((m, i) => (i === idx ? value : m)));
    };
    const addMainTopic = () => setMainTopicsList((prev) => [...prev, ""]);
    const removeMainTopic = (idx: number) => setMainTopicsList((prev) => prev.filter((_, i) => i !== idx));

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!file) {
            setErrorMessage("Silakan pilih file transkrip terlebih dahulu.");
            return;
        }

        if (!isValid) {
            setErrorMessage("Lengkapi seluruh metadata sebelum mengunggah.");
            return;
        }

        const formData = new FormData();
        formData.append("transcript_file", file);
        if (summaryFile) formData.append("summary_file", summaryFile);
        // join dynamic lists into comma-separated strings to match backend expectation
        const participantsStr = participantsList.map((p) => p.trim()).filter(Boolean).join(",");
        const mainTopicStr = mainTopicsList.map((m) => m.trim()).filter(Boolean).join(",");

        formData.append("agenda", agenda.trim());
        formData.append("date", date.trim());
        formData.append("start_time", startTime.trim());
        formData.append("end_time", endTime.trim());
        formData.append("location", location.trim());
        formData.append("participants", participantsStr);
        formData.append("main_topic", mainTopicStr);

        try {
            setIsSubmitting(true);
            const response = await fetch(`${API_BASE_URL}/api/ingest/transcript-upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody?.message || "Gagal mengunggah transkrip.");
            }

            const payload = await response.json();
            setSuccessMessage(
                payload?.message || "Transkrip berhasil dikirim. Proses akan berjalan di latar belakang."
            );
            setAgenda("");
            setDate("");
            setStartTime("");
            setEndTime("");
            setLocation("");
            setParticipantsList([""]);
            setMainTopicsList([""]);
            setFile(null);
            setSummaryFile(null);
        } catch (error: any) {
            setErrorMessage(error?.message || "Terjadi kesalahan saat mengunggah transkrip.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#034391] to-[#0256b8] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/30">
                            <FileUp className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Upload Transkrip</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Unggah file transkrip dan lengkapi metadata untuk diproses oleh sistem.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
                    {errorMessage && (
                        <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-950/30 px-4 py-3.5 text-sm text-red-600 dark:text-red-400 flex items-start gap-3">
                            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 rounded-xl bg-green-50 dark:bg-green-950/30 px-4 py-3.5 text-sm text-green-700 dark:text-green-400 flex items-start gap-3">
                            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                File Transkrip
                            </label>
                            <input
                                type="file"
                                accept=".txt"
                                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:rounded-xl file:bg-gradient-to-r file:from-[#034391] file:to-[#0256b8] file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:from-[#023068] hover:file:to-[#034391] file:transition-all file:shadow-md hover:file:shadow-lg file:cursor-pointer"
                            />
                            <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400">
                                Format yang didukung: .txt Maksimal ukuran mengikuti konfigurasi backend.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                File Summary (ringkasan)
                            </label>
                            <input
                                type="file"
                                accept=".txt"
                                onChange={(event) => setSummaryFile(event.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:rounded-xl file:bg-gradient-to-r file:from-[#06b6d4] file:to-[#0284c7] file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:from-[#0e7490] hover:file:to-[#0369a1] file:transition-all file:shadow-md hover:file:shadow-lg file:cursor-pointer"
                            />
                            <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400">
                                Unggah ringkasan pertemuan dalam format .txt. Backend mengharapkan file ringkasan terpisah.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                    Agenda
                                </label>
                                <input
                                    type="text"
                                    value={agenda}
                                    onChange={(event) => setAgenda(event.target.value)}
                                    placeholder="Contoh: Weekly Sync"
                                    className="w-full rounded-xl bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#034391] dark:focus:ring-[#0256b8] transition-all shadow-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                    Tanggal Meeting
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(event) => setDate(event.target.value)}
                                    className="w-full rounded-xl bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#034391] dark:focus:ring-[#0256b8] transition-all shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                    Jam Mulai
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(event) => setStartTime(event.target.value)}
                                    className="w-full rounded-xl bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#034391] dark:focus:ring-[#0256b8] transition-all shadow-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                    Jam Berakhir
                                </label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(event) => setEndTime(event.target.value)}
                                    className="w-full rounded-xl bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#034391] dark:focus:ring-[#0256b8] transition-all shadow-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                    Tempat Dilaksanakan
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(event) => setLocation(event.target.value)}
                                    placeholder="Contoh: Ruang Rapat A"
                                    className="w-full rounded-xl bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#034391] dark:focus:ring-[#0256b8] transition-all shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                Peserta Meeting
                            </label>
                            <div className="space-y-2">
                                {participantsList.map((p, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={p}
                                            onChange={(e) => updateParticipant(idx, e.target.value)}
                                            placeholder={idx === 0 ? "Contoh: Alice" : "Nama peserta"}
                                            className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#034391] dark:focus:ring-[#0256b8] transition-all shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeParticipant(idx)}
                                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            aria-label="Hapus peserta"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={addParticipant}
                                        className="inline-flex items-center gap-2 text-sm text-[#034391] hover:underline"
                                    >
                                        <Plus className="w-4 h-4" /> Tambah Peserta
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                Topik Utama
                            </label>
                            <div className="space-y-2">
                                {mainTopicsList.map((m, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={m}
                                            onChange={(e) => updateMainTopic(idx, e.target.value)}
                                            placeholder={idx === 0 ? "Contoh: Roadmap" : "Topik utama"}
                                            className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#034391] dark:focus:ring-[#0256b8] transition-all shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeMainTopic(idx)}
                                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            aria-label="Hapus topik"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={addMainTopic}
                                        className="inline-flex items-center gap-2 text-sm text-[#034391] hover:underline"
                                    >
                                        <Plus className="w-4 h-4" /> Tambah Topik
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 px-4 py-4 text-sm text-blue-700 dark:text-blue-400 flex gap-3">
                            <Info className="mt-0.5 h-5 w-5 flex-shrink-0" />
                            <p>
                                Metadata akan disimpan bersama transkrip dan digunakan untuk pencarian serta filter di sistem.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Pastikan file transkrip berformat teks agar bisa diproses dengan benar.
                            </p>
                            <Button
                                type="submit"
                                size="lg"
                                className="flex items-center gap-2 bg-gradient-to-r from-[#034391] to-[#0256b8] hover:from-[#023068] hover:to-[#034391] text-white shadow-lg hover:shadow-xl shadow-blue-900/30 hover:shadow-blue-900/40 transition-all duration-200 w-full sm:w-auto"
                                disabled={!isValid || isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileUp className="h-5 w-5" />}
                                {isSubmitting ? "Mengunggah..." : "Upload Transkrip"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
