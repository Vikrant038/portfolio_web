/**
 * Generates public/resume.pdf — a small placeholder PDF.
 * Run once: node scripts/make-resume-pdf.mjs
 * Replace the file with your real resume whenever you like.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "public", "resume.pdf");

const content = `BT
/F1 26 Tf
72 720 Td
(Ariadne Voss — Product Engineer) Tj
/F2 12 Tf
0 -34 Td
(Resume placeholder — replace public/resume.pdf with your real CV.) Tj
0 -22 Td
(hello@luxe.work  ·  Berlin, Germany  ·  luxe-portfolio.vercel.app) Tj
ET`;

const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
  `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
];

let pdf = "%PDF-1.4\n";
const offsets = [];
objects.forEach((obj, i) => {
  offsets.push(Buffer.byteLength(pdf, "latin1"));
  pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
});
const xrefStart = Buffer.byteLength(pdf, "latin1");
pdf += "xref\n0 " + (objects.length + 1) + "\n";
pdf += "0000000000 65535 f \n";
for (const off of offsets) {
  pdf += String(off).padStart(10, "0") + " 00000 n \n";
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, pdf, "latin1");
console.log("Wrote", out, Buffer.byteLength(pdf, "latin1"), "bytes");
