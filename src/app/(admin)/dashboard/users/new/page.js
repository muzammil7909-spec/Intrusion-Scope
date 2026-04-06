import AdminEditorPage from "../[id]/page";

export default async function NewAdminPage(props) {
  // Pass "new" as the id parameter
  const params = await Promise.resolve({ id: "new" });
  return <AdminEditorPage params={params} />;
}
