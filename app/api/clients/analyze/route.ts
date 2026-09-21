import { NextRequest, NextResponse } from "next/server";
import { analyzeExistingBrand } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";

// No depende de un clientId: se usa tanto al crear un cliente nuevo (con
// los datos que hay de momento en el formulario) como para "re-analizar"
// uno ya existente. Solo hace falta sesión iniciada.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Falta el nombre del cliente." }, { status: 400 });
  }

  try {
    const analysis = await analyzeExistingBrand({
      name: body.name,
      sector: body.sector || null,
      igHandle: body.igHandle || null,
      website: body.website || null,
    });
    return NextResponse.json(analysis);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
