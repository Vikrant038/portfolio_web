import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vikrant Yadav - AI Systems Engineer",
    short_name: "Vikrant Yadav",
    description:
      "AI automation, RAG pipelines, and data systems that turn manual workflows into measurable outcomes.",
    start_url: "/",
    display: "standalone",
    background_color: "#090B13",
    theme_color: "#090B13",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
