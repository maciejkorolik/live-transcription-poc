"use client";

import Image from "next/image";
import App from "./components/App";
import { XIcon } from "./components/icons/XIcon";
import { LinkedInIcon } from "./components/icons/LinkedInIcon";
import { FacebookIcon } from "./components/icons/FacebookIcon";
import GitHubButton from "react-github-btn";

const Home = () => {
  return (
    <>
      <div className="h-full overflow-hidden">
        <div className="h-[8rem] flex items-center">
          <header className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 flex items-center justify-center">
            <div>
              <a className="flex items-center" href="/">
                <Image
                  className="w-auto h-20 sm:max-w-none"
                  src="data:image/svg+xml,%3csvg%20fill='none'%20height='36'%20viewBox='0%200%2036%2036'%20width='36'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='m24.5718%2010.8521h-17.41791l-7.15389%207.2414%2017.6775%2017.9065%2014.0632-14.2453.0549-.0556v-5.2946l1.7423-1.7648v-5.29457l1.7423-1.76485v-7.58028l-10.7134%2010.8521zm9.1159-6.94312v3.00885l-21.237%2021.50187-1.4827-1.5019zm-1.7423%207.05942v3.0038l-16.8788%2017.0923-1.4827-1.5019zm-15.7456%2021.244%2014.0033-14.1846v3.0038l-12.5206%2012.6827z'%20fill='%23000'/%3e%3c/svg%3e"
                  alt="Monterail logo"
                  width={0}
                  height={0}
                  priority
                />
              </a>
            </div>
          </header>
        </div>

        {/* height 100% minus 8rem */}
        <main className="mx-auto px-4 md:px-6 lg:px-8 h-[calc(100%-4rem)] -mb-[4rem]">
          <App />
        </main>
      </div>
    </>
  );
};

export default Home;
