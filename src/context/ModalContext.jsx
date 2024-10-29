import { createContext, useState } from "react";
import PropTypes from "prop-types";

const ModalContext = createContext();

/**
 * ModalProvider component that provides modal state and actions to its children for the new deck modal.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components that will have access to the modal context.
 *
 * @returns {JSX.Element} The ModalContext provider with modal state and actions.
 *
 * @context
 * @property {boolean} modalOpen - Indicates whether the modal is open or not.
 * @property {function} openModal - Function to open the modal without any file.
 * @property {function} openModalwithFile - Function to open the modal with a file passed in already.
 * @property {function} closeModal - Function to close the modal.
 * @property {Object|null} file - The file data associated with the modal, if any.
 */

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
