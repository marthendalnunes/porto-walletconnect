import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="absolute bottom-6 flex w-full items-center justify-center">
      <span className="flex gap-1.5 text-lg">
        <Link
          className="flex items-center pr-1"
          href="https://github.com/marthendalnunes/porto-walletconnect"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image src="/github.svg" alt="Github Logo" width={20} height={20} />
        </Link>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline-offset-2 hover:underline"
          href="https://github.com/marthendalnunes"
        >
          Vitor Marthendal
        </a>
      </span>
    </footer>
  );
}
