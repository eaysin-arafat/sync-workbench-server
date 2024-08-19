import FormInput from "@/Component/UI/FormElements/FormInput";
import UploadFile from "../UploadFile";

const IdentityDetails = () => {
  return (
    <>
      <div className="grid gap-6">
        <FormInput label="UAN Number" placeholder="Type First Name" required />
        <FormInput
          label="Re-enter UAN Number"
          placeholder="Type First Name"
          required
        />
        <FormInput label="PAN Number" placeholder="Type First Name" required />
        <FormInput label="Father name" placeholder="Type First Name" required />
        <div>
          <UploadFile label="Username-PAN" required />
        </div>
        <FormInput
          label="Aadhar Number"
          placeholder="Type First Name"
          required
        />

        <div>
          <UploadFile label="Username-Asdhar" required />
        </div>
      </div>
    </>
  );
};

export default IdentityDetails;
