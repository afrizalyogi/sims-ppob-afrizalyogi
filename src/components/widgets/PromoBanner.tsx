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
      <h2 className="mb-4 text-lg font-semibold text-gray-800 sm:text-xl">
        Temukan promo menarik
      </h2>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {banners.map((banner, index) => (
          <div
            key={index}
            className="flex h-32 w-80 shrink-0 cursor-pointer overflow-hidden rounded-sm shadow-md"
            title={banner.banner_name}
          >
            <img
              src={banner.banner_image}
              alt={banner.banner_name}
              className="h-full w-full transform object-cover transition hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
