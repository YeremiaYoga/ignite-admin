// app/announcements/page.jsx
import AnnouncementPreview from "./components/AnnouncementPreview";
import AnnouncementBuilder from "./components/AnnouncementBuilder";

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        <AnnouncementPreview />
        <AnnouncementBuilder />
      </div>
    </div>
  );
}
