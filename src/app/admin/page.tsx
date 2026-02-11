"use client";

import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import {
    createEvent,
    deleteEvent,
    getEventsFromDb,
    updateEvent,
    verifyAdminPassword,
    type DbEventItem,
    type EventType,
} from "@/actions/events";

interface EventDraft {
    month: string;
    day: string;
    title: string;
    time: string;
    description: string;
    type: EventType;
    flyerSource: string;
    expirationDate: string;
}

const emptyDraft: EventDraft = {
    month: "",
    day: "",
    title: "",
    time: "4:00 PM - 7:00 PM",
    description: "",
    type: "special",
    flyerSource: "",
    expirationDate: "",
};

function toDraft(event: DbEventItem): EventDraft {
    return {
        month: event.month ?? "",
        day: event.day ?? "",
        title: event.title ?? "",
        time: event.time ?? "",
        description: event.description ?? "",
        type: (event.type as EventType) ?? "special",
        flyerSource: event.flyer_source ?? "",
        expirationDate: normalizeExpiration(event.expiration_date),
    };
}

function normalizeExpiration(value: unknown) {
    if (!value) return "";
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }

    return String(value);
}

function normalizeDbEvent(eventItem: DbEventItem): DbEventItem {
    return {
        ...eventItem,
        expiration_date: normalizeExpiration(eventItem.expiration_date),
    };
}

function buildPayload(draft: EventDraft) {
    return {
        month: draft.month.trim(),
        day: draft.day.trim(),
        title: draft.title.trim(),
        time: draft.time.trim(),
        description: draft.description.trim(),
        type: draft.type,
        flyer_source: draft.flyerSource.trim() || null,
        expiration_date: draft.expirationDate.trim() || null,
    };
}

export default function AdminPage() {
    const [events, setEvents] = useState<DbEventItem[]>([]);
    const [draft, setDraft] = useState<EventDraft>(emptyDraft);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [flyerInputKey, setFlyerInputKey] = useState(0);

    const [password, setPassword] = useState("");
    const [isAuthed, setIsAuthed] = useState(false);

    const sortedEvents = useMemo(
        () => [...events].sort((a, b) => a.id - b.id),
        [events]
    );

    useEffect(() => {
        const cached = sessionStorage.getItem("vw_admin_authed");
        if (cached === "true") {
            setIsAuthed(true);
        }
    }, []);

    useEffect(() => {
        if (!isAuthed) return;
        refreshEvents();
    }, [isAuthed]);

    async function refreshEvents() {
        setError(null);
        try {
            const data = await getEventsFromDb();
            setEvents(data.map(normalizeDbEvent));
        } catch (err) {
            console.error(err);
            setError("Unable to load events. Try again.");
        }
    }

    async function handleLogin(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setStatus(null);
        setBusy(true);
        try {
            const ok = await verifyAdminPassword(password);
            if (!ok) {
                setError("Invalid password or admin access not configured.");
                return;
            }

            sessionStorage.setItem("vw_admin_authed", "true");
            setIsAuthed(true);
            setPassword("");
        } catch (err) {
            console.error(err);
            setError("Login failed. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    function handleLogout() {
        sessionStorage.removeItem("vw_admin_authed");
        setIsAuthed(false);
        setDraft(emptyDraft);
        setEditingId(null);
        setStatus(null);
        setError(null);
    }

    function startEdit(eventItem: DbEventItem) {
        setEditingId(eventItem.id);
        setDraft(toDraft(eventItem));
        setStatus(null);
        setError(null);
    }

    function resetForm() {
        setEditingId(null);
        setDraft(emptyDraft);
        setFlyerInputKey((prev) => prev + 1);
    }

    function handleFlyerUpload(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result === "string") {
                setDraft({ ...draft, flyerSource: result });
            }
        };
        reader.onerror = () => {
            setError("Unable to read the image file.");
        };
        reader.readAsDataURL(file);
    }

    function clearFlyer() {
        setDraft({ ...draft, flyerSource: "" });
        setFlyerInputKey((prev) => prev + 1);
    }

    async function handleSave(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setStatus(null);

        const payload = buildPayload(draft);
        if (!payload.month || !payload.day || !payload.title) {
            setError("Month, day, and title are required.");
            return;
        }

        setBusy(true);
        try {
            if (editingId) {
                await updateEvent(editingId, payload);
                setStatus("Event updated.");
            } else {
                await createEvent(payload);
                setStatus("Event created.");
            }
            resetForm();
            await refreshEvents();
        } catch (err) {
            console.error(err);
            setError("Save failed. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    async function handleDelete(eventItem: DbEventItem) {
        const confirmed = window.confirm(
            `Delete "${eventItem.title}"? This cannot be undone.`
        );
        if (!confirmed) return;

        setBusy(true);
        setError(null);
        setStatus(null);
        try {
            await deleteEvent(eventItem.id);
            setStatus("Event deleted.");
            await refreshEvents();
        } catch (err) {
            console.error(err);
            setError("Delete failed. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="admin-container">
            <header className="admin-header">
                <div>
                    <h1 className="admin-title">Admin</h1>
                    <p className="admin-subtitle">Manage upcoming events</p>
                </div>
                {isAuthed && (
                    <button
                        type="button"
                        className="admin-button secondary"
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                )}
            </header>

            {!isAuthed ? (
                <section className="admin-card">
                    <h2 className="admin-section-title">Client login</h2>
                    <form className="admin-login" onSubmit={handleLogin}>
                        <label className="admin-label" htmlFor="admin-password">
                            Password
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            className="admin-input"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter admin password"
                            autoComplete="current-password"
                        />
                        <button className="admin-button" type="submit" disabled={busy}>
                            {busy ? "Checking..." : "Log in"}
                        </button>
                    </form>
                    {error && <p className="admin-error">{error}</p>}
                </section>
            ) : (
                <>
                    <section className="admin-card">
                        <h2 className="admin-section-title">
                            {editingId ? "Edit event" : "Add event"}
                        </h2>
                        <form className="admin-form" onSubmit={handleSave}>
                            <label className="admin-label">
                                Month
                                <input
                                    className="admin-input"
                                    value={draft.month}
                                    onChange={(event) =>
                                        setDraft({ ...draft, month: event.target.value })
                                    }
                                    placeholder="FEB"
                                />
                            </label>
                            <label className="admin-label">
                                Day
                                <input
                                    className="admin-input"
                                    value={draft.day}
                                    onChange={(event) =>
                                        setDraft({ ...draft, day: event.target.value })
                                    }
                                    placeholder="13"
                                />
                            </label>
                            <label className="admin-label admin-field--full">
                                Title
                                <input
                                    className="admin-input"
                                    value={draft.title}
                                    onChange={(event) =>
                                        setDraft({ ...draft, title: event.target.value })
                                    }
                                    placeholder="Valentine's Day Tasting"
                                />
                            </label>
                            <label className="admin-label">
                                Time
                                <input
                                    className="admin-input"
                                    value={draft.time}
                                    onChange={(event) =>
                                        setDraft({ ...draft, time: event.target.value })
                                    }
                                    placeholder="4:00 PM - 7:00 PM"
                                />
                            </label>
                            <label className="admin-label">
                                Type
                                <select
                                    className="admin-select"
                                    value={draft.type}
                                    onChange={(event) =>
                                        setDraft({
                                            ...draft,
                                            type: event.target.value as EventType,
                                        })
                                    }
                                >
                                    <option value="special">Special</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </label>
                            <label className="admin-label admin-field--full">
                                Description
                                <textarea
                                    className="admin-textarea"
                                    rows={4}
                                    value={draft.description}
                                    onChange={(event) =>
                                        setDraft({
                                            ...draft,
                                            description: event.target.value,
                                        })
                                    }
                                    placeholder="Describe the event"
                                />
                            </label>
                            <div className="admin-field--full">
                                <label className="admin-label" htmlFor="admin-flyer">
                                    Flyer image upload
                                </label>
                                <div className="admin-flyer-controls">
                                    <input
                                        key={flyerInputKey}
                                        id="admin-flyer"
                                        type="file"
                                        accept="image/*"
                                        className="admin-input"
                                        onChange={handleFlyerUpload}
                                    />
                                    <button
                                        type="button"
                                        className="admin-button secondary"
                                        onClick={clearFlyer}
                                        disabled={!draft.flyerSource}
                                    >
                                        Clear flyer
                                    </button>
                                </div>
                                {draft.flyerSource && (
                                    <div className="admin-flyer-preview">
                                        <img
                                            src={draft.flyerSource}
                                            alt="Flyer preview"
                                        />
                                    </div>
                                )}
                            </div>
                            <label className="admin-label">
                                Expiration date
                                <input
                                    type="date"
                                    className="admin-input"
                                    value={draft.expirationDate}
                                    onChange={(event) =>
                                        setDraft({
                                            ...draft,
                                            expirationDate: event.target.value,
                                        })
                                    }
                                />
                            </label>
                            <div className="admin-actions admin-field--full">
                                <button
                                    type="button"
                                    className="admin-button secondary"
                                    onClick={resetForm}
                                    disabled={busy}
                                >
                                    {editingId ? "Cancel" : "Clear"}
                                </button>
                                <button className="admin-button" type="submit" disabled={busy}>
                                    {busy ? "Saving..." : editingId ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                        {status && <p className="admin-status">{status}</p>}
                        {error && <p className="admin-error">{error}</p>}
                    </section>

                    <section className="admin-card">
                        <h2 className="admin-section-title">Current events</h2>
                        {sortedEvents.length === 0 ? (
                            <p className="admin-meta">No events yet.</p>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>When</th>
                                            <th>Title</th>
                                            <th>Type</th>
                                            <th>Expires</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedEvents.map((eventItem) => (
                                            <tr key={eventItem.id}>
                                                <td>
                                                    {eventItem.month} {eventItem.day}
                                                </td>
                                                <td>
                                                    <div className="admin-title-cell">
                                                        {eventItem.title}
                                                        <span className="admin-meta">
                                                            {eventItem.time}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="admin-badge">
                                                        {eventItem.type}
                                                    </span>
                                                </td>
                                                <td>
                                                    {eventItem.expiration_date ?? "-"}
                                                </td>
                                                <td className="admin-table-actions">
                                                    <button
                                                        type="button"
                                                        className="admin-button secondary"
                                                        onClick={() => startEdit(eventItem)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="admin-button danger"
                                                        onClick={() => handleDelete(eventItem)}
                                                        disabled={busy}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                    <footer className="admin-footer">
                        <a className="admin-back-link" href="/">
                            Return to site
                        </a>
                    </footer>
                </>
            )}
        </main>
    );
}
