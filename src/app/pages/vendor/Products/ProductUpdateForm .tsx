import { useSelector } from "react-redux";
import Navbar from "../../../../components/vendor/Navbar";
import { Sidebar } from "../../../../components/common/Sidebar";
import { delete_icon, VENDOR_NAV_LINKS } from "../../../../utils/constants";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import { useParams } from "react-router";

export function ProductUpdateForm() {
  const { isSidebarOpen } = useSelector((state: any) => state.sidebar);
  const { id } = useParams<{ id: string }>();
  const { control, register, handleSubmit,  setValue, formState: { errors } } = useForm({
    defaultValues: {
      productName: '',
      description: '',
      features: [
        { title: '', description: '' }
      ],
      basePrice: 0,
      stocks: 0,
      sku: '',
      category: '',
      productMedia: [],
      featureMedia: [],
      specificationAndFeatures: [],
      status: '',
      taxProfile: ''
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features"
  })
  const [productFiles, setProductFiles] = useState([]);

  const [featureFiles, setFeatureFiles] = useState([]);
  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>, currentFiles, setFiles, filedName) => {

    const newFiles = Array.from(e.target.files)
    const updatedFiles = [...currentFiles, ...newFiles]
    setFiles(updatedFiles);
    console.log(updatedFiles)
    setValue(filedName, updatedFiles);
  }
  console.log(productFiles)
  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  const removeFiles = (index, currentFiles, setFiles, filedName) => {
    const updatedFiles = currentFiles.filter((_, i) => i !== index)
    setFiles(updatedFiles);
    setValue(filedName, updatedFiles);
  }
  return (
    <>

      <Navbar title="Product Form" />
      <Sidebar NAV_LINKS={VENDOR_NAV_LINKS} />
      <main className={` mr-6 pt-3  ${isSidebarOpen ? 'ml-50 ' : 'ml-24 '}`}>
        <form onSubmit={handleSubmit(onSubmit)} >


          <header className="flex justify-between items-center my-6">
            <h1 className="text-2xl font-semibold mb-4">Create New Product</h1>
            <span className=" flex justify-between  gap-6 ">
              <button className="border-2 border-green-700 min-w-24 bg-green-600 text-white py-2 px-4 rounded-lg" >Save Template</button>
              <button className="border-2 border-yellow-700 min-w-24 bg-yellow-600 text-white py-2 px-4 rounded-lg" >Save Draft</button>
              <input type="submit" className="border-2 border-blue-700 min-w-24 bg-blue-600 text-white py-2 px-4 rounded-lg" value=" Update Product" />
            </span>
          </header>
          <div className="border-2 border-gray-300 p-4 rounded-lg">
            <h1>
              General Information
            </h1>
            <div>
              <label className="block mb-2 font-medium">Product Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2" 
               placeholder="Enter product name" {...register("productName", { required: "Product Name is required" })} />
              {errors.productName && <p className="text-red-500">{errors.productName.message}</p>}
            </div>
            <div className="mt-4">
              <label className="block mb-2 font-medium">Description</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter product description" {...register("description", { required: "Description is required" })} />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>
            <div className="mt-4">
              <label className="block mb-2 font-medium justify-self-end" >
                <button type="button" onClick={() => append({ title: '', description: '' })}
                  className="border-2 border-gray-300 py-2 px-4 rounded-lg">+ Add Product features </button>
              </label>
              {
                fields.map(
                  (field, index) => (
                    <div key={field.id}  >

                      <div className="my-4">
                        <span className="flex justify-between items-center   mt-4 ">
                          <label className="  font-medium ">
                            Feature Title

                          </label>
                          <button type="button" onClick={() => remove(index)}
                            className="border-2 border-red-500 py-2 px-4 rounded-lg mb-2"><img src={delete_icon} alt="" /></button>
                        </span>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter feature title" {...register(`features.${index}.title` as const, { required: "Feature Title is required" })} />
                        {errors.features && errors.features[index]?.title && <p className="text-red-500">{errors.features[index]?.title?.message}</p>}
                      </div>

                      <div className="mb-4">
                        <label className="block mb-2 font-medium">Feature Description</label>
                        <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter feature description"
                          {
                          ...register(`features.${index}.description` as const, { required: "Feature Description is required" })
                          } />
                        {errors.features && errors.features[index]?.description && <p className="text-red-500">{errors.features[index]?.description?.message}</p>}
                      </div>


                    </div>
                  )
                )
              }
            </div>
          </div>
          <div className="border-2 border-gray-300 p-4 rounded-lg my-4">
            <h1>Pricing & Inventory </h1>
            <span className="flex  w-full gap-6 justify-between">


              <div className="mt-4 flex-1">
                <label className="block mb-2 font-medium">Base Price</label>
                <input type="number" className=" w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter base price" {...register("basePrice", { required: "Base Price is required", min: { value: 0, message: "Base Price cannot be negative" } })} />
                {errors.basePrice && <p className="text-red-500">{errors.basePrice.message}</p>}
              </div>
              <div className="mt-4 flex-1">
                <label className="block mb-2 font-medium">Stocks</label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter stock quantity" {...register("stocks", { required: "Stocks is required", min: { value: 0, message: "Stocks cannot be negative" } })} />
                {errors.stocks && <p className="text-red-500">{errors.stocks.message}</p>}

              </div>
            </span>
            <div className="mt-4">
              <label className="block mb-2 font-medium">SKU</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter SKU" {...register("sku", { required: "SKU is required" })} />
              {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}
            </div>
          </div>
          <div className="border-2 p-4 my-4 border-gray-300 rounded-lg">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              <div className="border border-gray-300 rounded-xl p-4 shadow-sm bg-white">
                <h3 className="font-semibold mb-4">Product images & Media</h3>

                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">


                  <input
                    type="file"
                    multiple
                    accept="image/*, video/*"
                    className="hidden"
                    onChange={(e) => onSelectImage(e, productFiles, setProductFiles, 'productMedia')}
                  />


                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>

                    <p className="mb-1 text-sm text-gray-500 font-semibold">Click to upload image</p>
                    <p className="text-xs text-gray-400">PNG, JPG, Video up to 10MB</p>
                  </div>
                </label>

                <div className="mt-4 space-y-2">
                  {productFiles && productFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded text-sm">
                      <span className="truncate w-48">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFiles(index, productFiles, setProductFiles, 'productMedia')}
                        className="text-red-500 hover:text-red-700 font-bold px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>



              <div className="border  border-gray-300 rounded-xl p-4 shadow-sm bg-white">
                <h3 className="font-semibold mb-4">Product specification and features</h3>

                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">


                  <input
                    type="file"
                    multiple
                    accept="image/*, video/*"
                    className="hidden"
                    onChange={(e) => onSelectImage(e, featureFiles, setFeatureFiles, 'featureMedia')}
                  />


                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {/* Icon */}
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>

                    <p className="mb-1 text-sm text-gray-500 font-semibold">Click to upload image</p>
                    <p className="text-xs text-gray-400">PNG, JPG, Video up to 10MB</p>
                  </div>
                </label>


                <div className="mt-4 space-y-2">
                  {featureFiles && featureFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded text-sm">
                      <span className="truncate w-48">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFiles(index, featureFiles, setFeatureFiles, 'featureMedia')}
                        className="text-red-500 hover:text-red-700 font-bold px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="border-2 border-gray-300 my-4 p-4 rounded-lg">
            <h1>organization & TAXATION (GST)</h1>
            <div className="my-4">
              <label className="block mb-2 font-medium">Category</label>

              <select   {...register("category", { required: "Category is required" })} className="w-full border py-2 px-4 rounded-lg  border-gray-300" >
                <option value="">Select Product Category</option>
                <option value="electronic">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home_appliance">Home Appliance</option>
                <option value="books">Books</option>
                <option value="sports">Sports</option>

              </select>
              {errors.category && <p className="text-red-500">{errors.category.message}</p>}
            </div>
            <div className="my-4">
              <label className="block mb-2 font-medium">Status</label>
              <select   {...register("status", { required: "Status is required" })} className="w-full border py-2 px-4 rounded-lg  border-gray-300" >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && <p className="text-red-500">{errors.status.message}</p>}
            </div>
            <div className="my-4">
              <label className="block mb-2 font-medium">Tax Profile</label>
            </div>
            <select {...register('taxProfile', { required: "Tax Profile is required" })} className="w-full border py-2 px-4 rounded-lg  border-gray-300" >
              <option value="">Select Tax Profile</option>
              <option value="standard">{'GST (Apparel > 1000)'}</option>
              <option value="reduced">Reduced</option>
              <option value="zero">Zero</option>
            </select>
            {errors.taxProfile && <p className="text-red-500">{errors.taxProfile.message}</p>}
          </div>
        </form>
      </main>
    </>
  )
}
