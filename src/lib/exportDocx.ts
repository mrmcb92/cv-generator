import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import { CVData } from "@/types/cv";

import { fmtDate as formatDate } from "@/lib/format";

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "4B5563" },
    },
  });
}

export async function exportToDocx(data: CVData) {
  const { personal, experience, education, skills, languages, drivingLicenses } = data;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();

  const children: (Paragraph | Table)[] = [];

  // Name
  children.push(
    new Paragraph({
      children: [new TextRun({ text: fullName || "Nume Prenume", bold: true, size: 36 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );

  // Contact info
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
    personal.linkedin,
  ]
    .filter(Boolean)
    .join("  |  ");

  if (contacts) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contacts, size: 18, color: "6B7280" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );
  }

  // Summary
  if (personal.summary) {
    children.push(sectionHeading("Profil"));
    children.push(
      new Paragraph({ text: personal.summary, spacing: { after: 100 } })
    );
  }

  // Experience
  if (experience.length > 0) {
    children.push(sectionHeading("Experiență profesională"));
    for (const exp of experience) {
      if (exp.company) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: exp.company, bold: true, size: 22 })],
            spacing: { before: 150, after: 40 },
          })
        );
      }
      for (const pos of exp.positions) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: pos.title, bold: true }),
              new TextRun({
                text: `  ${formatDate(pos.startDate)} – ${pos.current ? "Prezent" : formatDate(pos.endDate)}`,
                color: "9CA3AF",
              }),
            ],
            indent: { left: 240 },
            spacing: { before: 60, after: 30 },
          })
        );
        if (pos.description) {
          children.push(
            new Paragraph({ text: pos.description, indent: { left: 240 }, spacing: { after: 80 } })
          );
        }
      }
    }
  }

  // Education
  if (education.length > 0) {
    children.push(sectionHeading("Educație"));
    for (const edu of education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree}${edu.field ? ` în ${edu.field}` : ""}`, bold: true }),
            new TextRun({ text: `  |  ${edu.institution}`, color: "6B7280" }),
            new TextRun({
              text: `  ${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}`,
              color: "9CA3AF",
            }),
          ],
          spacing: { before: 150, after: 50 },
        })
      );
    }
  }

  // Skills & Languages in two columns via table
  if (skills.length > 0 || languages.length > 0) {
    const skillRows = skills.map(
      (s) =>
        new Paragraph({
          children: [
            new TextRun({ text: s.name }),
            new TextRun({ text: `  – ${s.level}`, color: "9CA3AF" }),
          ],
          spacing: { after: 40 },
        })
    );

    const langRows = languages.map(
      (l) =>
        new Paragraph({
          children: [
            new TextRun({ text: l.name }),
            new TextRun({ text: `  – ${l.level}`, color: "9CA3AF" }),
          ],
          spacing: { after: 40 },
        })
    );

    const tableRows = [];

    // Header row
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [sectionHeading("Competențe")],
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
          new TableCell({
            children: [sectionHeading("Limbi străine")],
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
        ],
      })
    );

    const maxLen = Math.max(skillRows.length, langRows.length);
    for (let i = 0; i < maxLen; i++) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [skillRows[i] ?? new Paragraph("")],
              borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [langRows[i] ?? new Paragraph("")],
              borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        })
      );
    }

    children.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
  }

  // Driving licenses
  if (drivingLicenses?.length > 0) {
    children.push(sectionHeading("Permis de conducere"));
    children.push(
      new Paragraph({
        children: drivingLicenses.flatMap((d, i) => [
          ...(i > 0 ? [new TextRun({ text: "   |   ", color: "D1D5DB" })] : []),
          new TextRun({ text: `Categoria ${d.category}`, bold: true }),
          ...(d.year ? [new TextRun({ text: ` – ${d.year}`, color: "9CA3AF" })] : []),
        ]),
        spacing: { before: 100, after: 40 },
      })
    );
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `cv-${personal.lastName || "export"}.docx`);
}
