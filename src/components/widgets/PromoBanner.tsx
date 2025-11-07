interface Banner {
  banner_name: string;
  banner_image: string;
}

interface PromoBannerProps {
  banners: Banner[];
}

export default function PromoBanner({ banners }: PromoBannerProps) {
  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Temukan promo menarik
      </h2>

      <div className="flex overflow-x-auto space-x-4 pb-4">
        {banners.map((banner, index) => (
          <div
            key={index}
            className="flex shrink-0 w-80 h-32 rounded-lg shadow-md overflow-hidden cursor-pointer"
            title={banner.banner_name}
          >
            <img
              src={banner.banner_image}
              alt={banner.banner_name}
              className="w-full h-full object-cover transition transform hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
