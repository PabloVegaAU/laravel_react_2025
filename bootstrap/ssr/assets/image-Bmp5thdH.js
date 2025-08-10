import { jsx } from "react/jsx-runtime";
const Image = ({
  src,
  alt,
  className = "",
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "img",
    {
      src,
      alt,
      className: `object-cover ${className}`,
      ...props
    }
  );
};
export {
  Image as I
};
