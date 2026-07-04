export default function LoadingTable() {
  return (
    <div className="bg-white rounded-xl p-6 animate-pulse">

      {[1,2,3,4,5,6].map((i)=>(
        <div
          key={i}
          className="h-12 bg-gray-200 rounded mb-3"
        />
      ))}

    </div>
  );
}