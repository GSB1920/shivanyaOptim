import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigProvider } from "@/context/ConfigContext";
import AdminPage from "@/app/admin/page";
import { DEFAULT_CONFIG } from "@/lib/defaultConfig";

describe("Admin settings persistence", () => {
  let savedConfig: any;

  beforeEach(() => {
    savedConfig = null;

    (global as any).fetch = jest.fn(async (url: string, options?: any) => {
      if (url === "/api/config") {
        const method = (options?.method || "GET").toUpperCase();
        if (method === "GET") {
          const payload = savedConfig ?? DEFAULT_CONFIG;
          return new Response(JSON.stringify(payload), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
        if (method === "POST") {
          savedConfig = JSON.parse(options?.body ?? "{}");
          return new Response(JSON.stringify(savedConfig), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    (global as any).FileReader = class MockFileReader {
      public result: string | ArrayBuffer | null = null;
      public onload: null | (() => void) = null;
      public onerror: null | (() => void) = null;
      readAsDataURL(file: File) {
        this.result = `data:${file.type};base64,AAAA`;
        if (this.onload) this.onload();
      }
    };
  });

  it("saves logo/favicon/company title and reloads them on reopening admin", async () => {
    const user = userEvent.setup();

    const renderAdmin = () =>
      render(
        <ConfigProvider>
          <AdminPage />
        </ConfigProvider>
      );

    const firstRender = renderAdmin();
    const { unmount } = firstRender;

    await waitFor(() => {
      expect((global as any).fetch).toHaveBeenCalled();
    });

    await user.type(screen.getByPlaceholderText("admin@example.com"), "admin@veda.com");
    await user.type(screen.getByPlaceholderText("********"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await screen.findByText("Site Configuration");

    const companyNameInput = firstRender.container.querySelector(
      'input[name="companyName"]'
    ) as HTMLInputElement;
    const metaTitleInput = firstRender.container.querySelector(
      'input[name="metaTitle"]'
    ) as HTMLInputElement;
    expect(companyNameInput).toBeTruthy();
    expect(metaTitleInput).toBeTruthy();

    fireEvent.change(companyNameInput, { target: { value: "My Company" } });
    fireEvent.change(metaTitleInput, { target: { value: "My Title" } });

    const logoInput = firstRender.container.querySelector("#logoImageFile") as HTMLInputElement;
    const faviconInput = firstRender.container.querySelector("#faviconFile") as HTMLInputElement;
    expect(logoInput).toBeTruthy();
    expect(faviconInput).toBeTruthy();

    fireEvent.change(logoInput, {
      target: {
        files: [new File(["x"], "logo.png", { type: "image/png" })],
      },
    });
    fireEvent.change(faviconInput, {
      target: {
        files: [new File(["y"], "favicon.png", { type: "image/png" })],
      },
    });

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      expect((global as any).fetch).toHaveBeenCalledWith(
        "/api/config",
        expect.objectContaining({ method: "POST" })
      );
    });

    expect(savedConfig.companyName).toBe("My Company");
    expect(savedConfig.metaTitle).toBe("My Title");
    expect(typeof savedConfig.logoImage).toBe("string");
    expect(typeof savedConfig.favicon).toBe("string");

    unmount();

    const secondRender = renderAdmin();

    await waitFor(() => {
      expect((global as any).fetch).toHaveBeenCalled();
    });

    await user.type(screen.getByPlaceholderText("admin@example.com"), "admin@veda.com");
    await user.type(screen.getByPlaceholderText("********"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await screen.findByText("Site Configuration");

    const companyNameInputAfter = secondRender.container.querySelector(
      'input[name="companyName"]'
    ) as HTMLInputElement;
    const metaTitleInputAfter = secondRender.container.querySelector(
      'input[name="metaTitle"]'
    ) as HTMLInputElement;
    expect(companyNameInputAfter.value).toBe("My Company");
    expect(metaTitleInputAfter.value).toBe("My Title");

    expect(screen.getByText("Saved logo is set")).toBeInTheDocument();
    expect(screen.getByText("Saved favicon is set")).toBeInTheDocument();
  });
});
