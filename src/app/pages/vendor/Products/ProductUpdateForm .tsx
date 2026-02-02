import { useParams } from "react-router";

 

export   function ProductUpdateForm () {
    const {id} = useParams<{id: string}>();   
  return (
    <div>
      <h1>Update Product</h1>
    </div>
  )
}
