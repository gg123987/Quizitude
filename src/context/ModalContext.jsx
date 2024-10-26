import { createContext, useState } from "react";
import PropTypes from "prop-types";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);

  const openModal = () => {
    setFile(null);
    setIsModalOpen(true);
  };

  const openModalwithFile = (fileData = null) => {
    setFile(fileData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
  };

  return (
    <ModalContext.Provider
      value={{ modalOpen, openModal, openModalwithFile, closeModal, file }}
    >
      {children}
    </ModalContext.Provider>
  );
};

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ModalContext;
