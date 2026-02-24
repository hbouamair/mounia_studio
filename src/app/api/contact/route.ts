import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getContactEmailHtml } from "@/lib/contact-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = "Mouniaarji@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "RJ Studio <onboarding@resend.dev>";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured. Add RESEND_API_KEY to your environment." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Le nom est requis." },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "L'email est requis." },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Le message est requis." },
        { status: 400 }
      );
    }

    const html = getContactEmailHtml({
      name: name.trim(),
      email: email.trim(),
      phone: typeof phone === "string" && phone.trim() ? phone.trim() : undefined,
      message: message.trim(),
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email.trim(),
      subject: `[RJ Studio] Message de ${name.trim()}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message || "Échec de l'envoi de l'email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Une erreur inattendue s'est produite." },
      { status: 500 }
    );
  }
}
