import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    layout("routes/dashboard/_layout.tsx", [
      route("dashboard", "routes/dashboard/_index.tsx"),
      route("dashboard/notes", "routes/notes/_index.tsx"),
      route("dashboard/notes/new", "routes/notes/new.tsx"),
      route("dashboard/notes/:noteId", "routes/notes/$noteId.tsx"),
      route("dashboard/voice", "routes/voice/_index.tsx"),
      route("dashboard/voice/record", "routes/voice/record.tsx"),
  route("dashboard/transcripts", "routes/transcripts/index.tsx"),
      route("dashboard/transcripts/upload", "routes/transcripts/upload.tsx"),
      route("dashboard/admin/users", "routes/dashboard/admin-users.tsx"),
      // AI routes with their own layout for dual sidebar
      layout("routes/ai/_layout.tsx", [
        route("dashboard/ai", "routes/ai/_index.tsx"),
        route("dashboard/ai/:aiId", "routes/ai/$aiId.tsx"),
      ]),
    ]),
  ])
] satisfies RouteConfig;
