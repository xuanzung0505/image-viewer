import { MutableRefObject, useEffect } from "react";

function useClickOutside({
  ref,
  cb,
}: {
  ref: MutableRefObject<null | HTMLElement>;
  cb: () => void;
}) {
  function handleClickOutside(event: MouseEvent) {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      cb();
    }
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
}

export default useClickOutside;
