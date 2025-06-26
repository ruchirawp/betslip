export default function UploadArea({ setImage }) {
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:border-blue-500 transition"
    >
      <svg
        className="w-12 h-12 text-gray-400 mb-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 15a4 4 0 014-4h10a4 4 0 014 4v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4zm16-3V7a4 4 0 00-8 0v5m4-5h.01"
        />
      </svg>

      <p className="text-gray-600 mb-2 text-sm text-center">
        Drag and drop your bet slip image here, or click below to select
      </p>

      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-[#f97315] hover:bg-orange-600 text-white px-4 py-2 rounded shadow mt-2"
      >
        Upload Image
      </label>

      <input
        id="file-upload"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
