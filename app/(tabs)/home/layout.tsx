export default function HomeLayout({
  children,
  modal,
  detailModal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  detailModal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
      {detailModal}
    </>
  );
}
