import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function main() {
  try {
    await prisma.$connect();
  } catch (e) {
    return Error("Erro ao conectar Banco de dados!");
  }
}

export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();
    const posts = await prisma.post.findMany();
    return NextResponse.json({ msg: "Sucesso", posts }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ msg: "Erro!", e }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { title, description } = await req.json();
    await main();
    const post = await prisma.post.create({ data: { description, title } });
    return NextResponse.json({ msg: "Sucesso!", post }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ msg: "Erro!", e }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
