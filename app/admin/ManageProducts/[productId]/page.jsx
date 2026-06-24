

export default async function ProductDetails({params}) {
    const resolvedParams = await params;
    const productId = resolvedParams?.productId ? String(resolvedParams.productId).trim() : "";

    return (<div>
        
    </div>);
}