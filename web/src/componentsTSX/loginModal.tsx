import * as Dialog from "@radix-ui/react-dialog";
import { useAuthStore } from "../store/authStore";
import "./styles/loginModal.css";
import GoogleAuth from "../componentsJSX/googleAuth";

function LoginModal() {
  const { isLoginOpen, closeLogin } = useAuthStore();

  return (
    <Dialog.Root
      open={isLoginOpen}
      onOpenChange={(open) => !open && closeLogin()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content className="dialog-content">
          <Dialog.Title className="dialog-title">Login</Dialog.Title>
          <Dialog.Description className="dialog-description">
            Faça login com sua conta Hoodwink
          </Dialog.Description>

          <GoogleAuth />

          <Dialog.Close asChild>
            <button className="close-button">Fechar</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default LoginModal;
