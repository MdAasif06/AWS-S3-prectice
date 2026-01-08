import Image from "next/image";

export default async function Home() {
  const res = await fetch("http://localhost:3200/api/products");
  if (!res.ok) {
    console.log("Errror loading produts");
  }
  const products = await res.json();
  console.log("products", products);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
        >
          {/* Image */}
          <Image src={`https://d2rgd30snnj18q.cloudfront.net/${product.filename}`}
            alt={product.name}
            width={100}
            height={200}
            className="h-48 w-full object-cover"
          />

          {/* Content */}
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-bold text-indigo-600">
                ₹{product.price}
              </span>

              <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
