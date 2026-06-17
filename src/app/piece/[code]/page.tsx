import { redirect } from "next/navigation";

type LegacyPiecePageProps = {
  params: Promise<{ code: string }>;
};

export default async function LegacyPiecePage({
  params,
}: LegacyPiecePageProps) {
  const { code } = await params;

  redirect(`/pieces/${encodeURIComponent(code)}`);
}
