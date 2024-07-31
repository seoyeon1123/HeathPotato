interface IFormButton {
  loading: boolean;
  text: string;
}

export default function FormButton({ loading, text }: IFormButton) {
  return (
    <button
      disabled={loading}
      className="primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {loading ? '로딩 중...' : text}
    </button>
  );
}

//로딩중일 때 -> disabled
