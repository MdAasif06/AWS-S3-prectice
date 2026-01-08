"use client";

import { useState } from "react";

export default function CreateProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [filename, setFilename] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0]; //only first file
    if (file) {
      //mime
      const mime = file.type.split("/")[1];
      console.log("mime", mime);

      //send the request to our server to get a presigned url
      const response = await fetch(
        `http://localhost:3200/api/get-presigned-url`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            mime,
          }),
        }
      );
      if (!response.ok) {
        console.log(`Error getting presigned url`);
        return;
      }
      const data = await response.json();
      console.log("data", data);
      setFilename(data.finalName);
      //uploda the file s3
      const res = await fetch(data.url, {
        method: "PUT",
        headers: {
          "content-type": file.type || "application/octet-stream",
        },
        body: file, //binary payload
      });
      if (!res.ok) {
        console.log(`Error uploading the file s3`);
        return;
      }
      console.log("success");
      console.log(`selected file`, file);
    }
  };

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3200/api/products", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        price,
        filename,
      }),
    });
    if (!res) {
      console.error("failed to create a product");
      return;
    }
    console.log("success")
    //todo : form the clear
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Product Name"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          rows="3"
          required
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          placeholder="Price"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          onChange={handleImageChange}
          type="file"
          accept="image/*"
          className="w-full text-sm"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}

// "use client";
// import { useState } from "react";

// export default function CreateProductForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     image: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("description", formData.description);
//     data.append("price", formData.price);
//     data.append("image", formData.image);
//     console.log("Product submitted");
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-4"
//     >
//       <input
//         type="text"
//         name="name"
//         placeholder="Product Name"
//         value={formData.name}
//         onChange={handleChange}
//         required
//         className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
//       />

//       <textarea
//         name="description"
//         placeholder="Description"
//         value={formData.description}
//         onChange={handleChange}
//         required
//         className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
//       />

//       <input
//         type="number"
//         name="price"
//         placeholder="Price"
//         value={formData.price}
//         onChange={handleChange}
//         required
//         className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
//       />

//       <input
//         type="file"
//         name="image"
//         accept="image/*"
//         onChange={handleChange}
//         required
//         className="w-full text-sm"
//       />

//       <button
//         type="submit"
//         className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
//       >
//         Create Product
//       </button>
//     </form>
//   );
// }
