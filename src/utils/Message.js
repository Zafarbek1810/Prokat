import {toast} from "react-toastify";

const Message = {
  serverError: function () {
    toast.error("Сервер билан боғланишда хатолик юз берди :(");
  },
  unauthorizedError: function () {
    toast.error("Сиз рўйхатдан ўтмагансиз!");
  },
  success () {
    toast.success("Muvaffaqiyatli amalga oshdi!");
  },
  error() {
    toast.error("Kutilmagan xatolik yuz berdi!");
  }
}


export default Message
