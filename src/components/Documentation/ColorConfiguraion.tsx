export const ColorConfiguration = () => {
  return (
    <>
      <h3 className=" text-black text-xl font-semibold mt-8 dark:text-white">
        Colors
      </h3>
      <div className="p-6 rounded-md border mt-4 border-border dark:border-dark_border">
        <p className="text-base font-medium text-midnight_text dark:text-white dark:text-opacity-50">
          <span className="font-semibold text-lg dark:text-white">
            1. Override Colors
          </span>
          <br />
          For any change in colors : /src/utils/extendedConfig.ts
        </p>
        <div className="py-4 px-5 rounded-md bg-black mt-8">
          <p className="text-sm text-gray-400 flex flex-col gap-2">
            <span>primary: &quot;#2F73F2&quot;,</span>
            <span>danger: &quot;#DC3545&quot;,</span>
            <span>danger_text: &quot;#FF3C78&quot;,</span>
            <span>green: &quot;#3CD278&quot;,</span>
            <span>grey: &quot;#8E8E8E&quot;,</span>
            <span>muted: &quot;#547593&quot;,</span>
            <span>midnight_text: &quot;#102D47&quot;,</span>
            <span>border: &quot;#DFEBFC&quot;,</span>
            <span>darkmode: &quot;#08162B&quot;,</span>
            <span>heroBg: &quot;#F3F9FD&quot;,</span>
            <span>darkHeroBg: &quot;#121C2E&quot;,</span>
            <span>darkheader: &quot;#141D2F&quot;,</span>
            <span>dark_border: &quot;#253C50&quot;,</span>
            <span>foottext: &quot;#668199&quot;,</span>
            <span>search: &quot;#163858&quot;,</span>
            <span>dark_b: &quot;#1B2C44&quot;,</span>
          </p>
        </div>
      </div>
      <div className="p-6 rounded-md border mt-4 border-border dark:border-dark_border">
        <p className="text-base font-medium text-midnight_text dark:text-white dark:text-opacity-50">
          <span className="font-semibold text-lg dark:text-white">
            2. Override Theme Colors
          </span>
          <br />
          For change , go to : /src/utils/extendedConfig.ts
        </p>
        <div className="py-4 px-5 rounded-md bg-black mt-8">
          <p className="text-sm text-gray-400 flex flex-col gap-2">
            <span>primary: &quot;#2F73F2&quot;,</span>
            <span>darkmode: &quot;#08162B&quot;,</span>
          </p>
        </div>
      </div>
    </>
  );
};
