import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/images/logos/my_blog_logo.svg"
          alt="My Logo"
          width={500}
          height={100}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <div className="mb-2 tracking-[-.01em]">
            <p>這裡是一個數學系畢業的不專業工程師亂講話的地方。</p>
            <p>平常工作是用python打雜。</p>
            <p>
              某天突然想到，如果能寫一個部落格放自己的筆記，一定超帥的吧......
            </p>
            <p>所以就出現了這個東西。</p>
          </div>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/posts"
          >
            查看文章
          </Link>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] gap-2"
            href="https://github.com/johnny880319/rambling-blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              aria-hidden
              src="/images/icons/new_page_icon.svg"
              alt="New Page icon"
              width={16}
              height={16}
            />
            網站原始碼
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/tsung-yi-ma-44bb6a268"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/images/icons/linkedin_icon.svg"
            alt="LinkedIn icon"
            width={16}
            height={16}
          />
          Tsung-Yi Ma
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/johnny880319"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/images/icons/github_icon.svg"
            alt="GitHub icon"
            width={16}
            height={16}
          />
          chounan_ma
        </a>
      </footer>
    </div>
  );
}
