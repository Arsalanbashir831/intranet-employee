import { KnowledgeBaseFolderView } from "@/components/knowledge-base/knowledge-base-folder-view";

export default async function KnowledgeBaseSlug({
	params,
}: {
	params: Promise<{ slug?: string[] }>; // note Promise
}) {
	const { slug } = await params; // ✅ must await
	const folderName = slug?.[0] || "Unknown Folder";

	return <KnowledgeBaseFolderView  folderName={folderName} />;
}
