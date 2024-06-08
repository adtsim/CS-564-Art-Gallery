import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  fetchCollections,
  fetchArtworksByMaker,
} from "../../src/services/apiService";
import Collections from "../../src/components/Collections";
import CollectionDetails from "../../src/components/CollectionDetails";
import { Bar } from "react-chartjs-2";

// Mocking the API services
jest.mock("../../src/services/apiService.js", () => ({
  fetchCollections: jest.fn(),
  fetchArtworksByMaker: jest.fn(),
}));

// Mocking Chart.js Bar component
jest.mock("react-chartjs-2", () => ({
  Bar: jest.fn(() => <div>Bar Chart</div>),
}));

describe("Collections Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly and fetches collections data", async () => {
    fetchCollections.mockResolvedValue([
      { principalOrFirstMaker: "Artist 1" },
      { principalOrFirstMaker: "Artist 2" },
      { principalOrFirstMaker: "Artist 3" },
    ]);

    await act(async () => {
      render(
        <MemoryRouter>
          <Collections />
        </MemoryRouter>
      );
    });

    expect(fetchCollections).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Artists")).toBeInTheDocument();
  });

  it("displays bar chart with correct data", async () => {
    fetchCollections.mockResolvedValue([
      { principalOrFirstMaker: "Artist 1" },
      { principalOrFirstMaker: "Artist 2" },
      { principalOrFirstMaker: "Artist 3" },
    ]);

    await act(async () => {
      render(
        <MemoryRouter>
          <Collections />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText("Bar Chart")).toBeInTheDocument();
    expect(Bar).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          labels: ["Artist 1", "Artist 2", "Artist 3"],
          datasets: [
            expect.objectContaining({
              label: "Number of Artworks",
              data: [1, 1, 1],
            }),
          ],
        }),
      }),
      {}
    );
  });

  it("displays artist links and handles hover effect", async () => {
    fetchCollections.mockResolvedValue([
      { principalOrFirstMaker: "Artist 1" },
      { principalOrFirstMaker: "Artist 2" },
      { principalOrFirstMaker: "Artist 3" },
    ]);

    await act(async () => {
      render(
        <MemoryRouter>
          <Collections />
        </MemoryRouter>
      );
    });

    const artistLink = await screen.findByText("Artist 1");
    expect(artistLink).toBeInTheDocument();

    fireEvent.mouseEnter(artistLink);
    expect(artistLink).toHaveStyle("background-color: #2c3e50");

    fireEvent.mouseLeave(artistLink);
    expect(artistLink).toHaveStyle("background-color: transparent");
  });

  it("handles error state correctly", async () => {
    fetchCollections.mockRejectedValue(new Error("Failed to fetch"));

    await act(async () => {
      render(
        <MemoryRouter>
          <Collections />
        </MemoryRouter>
      );
    });

    await waitFor(() =>
      expect(
        screen.getByText("Failed to load collections.")
      ).toBeInTheDocument()
    );
  });
});

describe("CollectionDetails Component Tests", () => {
  const mockArtworks = [
    {
      id: "1",
      title: "Artwork 1",
      webImage: { url: "http://example.com/artwork1.jpg" },
      longTitle: "Artwork 1 Description",
    },
    {
      id: "2",
      title: "Artwork 2",
      webImage: { url: "http://example.com/artwork2.jpg" },
      longTitle: "Artwork 2 Description",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly and fetches artworks by maker", async () => {
    fetchArtworksByMaker.mockResolvedValue(mockArtworks);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/collection-details/Artist%201"]}>
          <Routes>
            <Route
              path="/collection-details/:maker"
              element={<CollectionDetails />}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(fetchArtworksByMaker).toHaveBeenCalledWith("Artist 1");
    expect(await screen.findByText("Artworks by Artist 1")).toBeInTheDocument();
  });

  it("displays artworks with correct details", async () => {
    fetchArtworksByMaker.mockResolvedValue(mockArtworks);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/collection-details/Artist%201"]}>
          <Routes>
            <Route
              path="/collection-details/:maker"
              element={<CollectionDetails />}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(await screen.findByText("Artwork 1")).toBeInTheDocument();
    expect(screen.getByAltText("Artwork 1")).toHaveAttribute(
      "src",
      "http://example.com/artwork1.jpg"
    );
    expect(screen.getByText("Artwork 1 Description")).toBeInTheDocument();

    expect(await screen.findByText("Artwork 2")).toBeInTheDocument();
    expect(screen.getByAltText("Artwork 2")).toHaveAttribute(
      "src",
      "http://example.com/artwork2.jpg"
    );
    expect(screen.getByText("Artwork 2 Description")).toBeInTheDocument();
  });

  it("handles artworks with no image correctly", async () => {
    fetchArtworksByMaker.mockResolvedValue([
      {
        id: "1",
        title: "Artwork 1",
        webImage: null,
        longTitle: "Artwork 1 Description",
      },
    ]);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/collection-details/Artist%201"]}>
          <Routes>
            <Route
              path="/collection-details/:maker"
              element={<CollectionDetails />}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(await screen.findByText("Artwork 1")).toBeInTheDocument();
    expect(screen.getByText("No image available.")).toBeInTheDocument();
  });

  it("handles error state correctly", async () => {
    fetchArtworksByMaker.mockRejectedValue(new Error("Failed to fetch"));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/collection-details/Artist%201"]}>
          <Routes>
            <Route
              path="/collection-details/:maker"
              element={<CollectionDetails />}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() =>
      expect(screen.getByText("Failed to load artworks.")).toBeInTheDocument()
    );
  });
});
