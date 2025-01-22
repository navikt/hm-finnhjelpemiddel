import { redirect } from "next/navigation";


type Props = {
  params: Promise<{ hmsartnr: string }>
}
export default async function RedirectToHmsArtNrProductPage(props: Props) {

  const params = await props.params;

  redirect(`/produkt/hmsartnr/${params.hmsartnr}`)

}
