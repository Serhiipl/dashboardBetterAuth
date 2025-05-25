import ShowServices from "./dashboard/services/components/showServices";

export default function AdminPage() {
  return (
    <div className="flex flex-col justify-center w-full">
      <h1>Twoja Lista</h1>
      <div>
        <ShowServices />
      </div>
    </div>
  );
}
