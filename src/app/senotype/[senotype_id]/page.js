import SenotypeClientComponent from './SenotypeClientComponent';

export async function generateMetadata({ params }) {
  const { senotype_id } = await params;

  return {
    title: `Senotype`,
  };
}

export default async function Page({ params }) {
  const { senotype_id } = await params;

  return <SenotypeClientComponent senotype_id={senotype_id} />;
}
