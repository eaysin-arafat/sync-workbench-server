import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneNumberInputProps {
  label: string;
  required: boolean;
  value: string;
  setValue: (value: string | undefined) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  required,
  value,
  setValue,
}) => {
  return (
    <div>
      {label && (
        <div className="flex w-full">
          <div className="text-[#696F79] leading-[125%] text-base font-semibold mb-[5px] ms-[2px] truncate">
            {label}
          </div>
          {required && (
            <span className="transform -translate-y-0.5 mx-1 text-red-600 text-base">
              *
            </span>
          )}
        </div>
      )}

      <PhoneInput
        international
        defaultCountry="IN"
        value={value}
        onChange={setValue}
        placeholder="Enter 10 Digit Mobile Number"
        containerComponent={"div"}
        style={{
          border: "1px solid #e4e4e4",
          padding: "0 12px",
          borderRadius: "4px",
          height: "45px",
        }}
        numberInputProps={{
          className: "px-2 focus:outline-none",
        }}
      />
    </div>
  );
};

export default PhoneNumberInput;
