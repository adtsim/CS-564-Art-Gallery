import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GalleryContext } from "../../src/context/GalleryContext.jsx";
import Analyze from "../../src/components/Analyze.jsx";

jest.mock("../../src/components/BarGraph.jsx", () => {
  return function DummyBarGraphContainer() {
    return <div>BarGraphContainer</div>;
  };
});

jest.mock("../../src/components/ArtworkPieChart.jsx", () => {
  return function DummyArtworkPieChart() {
    return <div>ArtworkPieChart</div>;
  };
});

jest.mock("../../src/components/Gallery.jsx", () => {
  return function DummyGalleryCard() {
    return <div>GalleryCard</div>;
  };
});

jest.mock("../../src/components/ArtistBiographyCards.jsx", () => {
  return function DummyArtistBiographyCards() {
    return <div>ArtistBiographyCards</div>;
  };
});

describe("Analyze Component Tests", () => {
  const mockFetchData = jest.fn();
  const mockFetchCenturyData = jest.fn();
  const mockUpdateSelection = jest.fn();

  const contextValue = {
    data: {},
    loading: false,
    updateSelection: mockUpdateSelection,
    fetchCenturyData: mockFetchCenturyData,
    fetchData: mockFetchData,
    centuryData: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly and fetches data initially", () => {
    render(
      <GalleryContext.Provider value={contextValue}>
        <Analyze />
      </GalleryContext.Provider>
    );
    expect(mockFetchData).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("combobox", { name: "Type:" })).toBeInTheDocument();
  });

  it("displays loading message when loading is true", () => {
    render(
      <GalleryContext.Provider value={{ ...contextValue, loading: true }}>
        <Analyze />
      </GalleryContext.Provider>
    );
    expect(
      screen.getByText("Please wait, data is being fetched.")
    ).toBeInTheDocument();
  });

  it("switches to BarGraph view when selected", () => {
    render(
      <GalleryContext.Provider value={contextValue}>
        <Analyze />
      </GalleryContext.Provider>
    );

    fireEvent.change(screen.getByRole("combobox", { name: "View:" }), {
      target: { value: "bargraph" },
    });

    expect(screen.getByText("BarGraphContainer")).toBeInTheDocument();
  });

  it("switches to PieChart view when selected", () => {
    render(
      <GalleryContext.Provider value={contextValue}>
        <Analyze />
      </GalleryContext.Provider>
    );

    fireEvent.change(screen.getByRole("combobox", { name: "View:" }), {
      target: { value: "piechart" },
    });

    expect(mockFetchCenturyData).toHaveBeenCalledTimes(1);
    expect(screen.getByText("ArtworkPieChart")).toBeInTheDocument();
  });

  it("switches to Gallery view when selected", () => {
    render(
      <GalleryContext.Provider value={contextValue}>
        <Analyze />
      </GalleryContext.Provider>
    );

    fireEvent.change(screen.getByRole("combobox", { name: "View:" }), {
      target: { value: "gallery" },
    });

    expect(screen.getByText("GalleryCard")).toBeInTheDocument();
  });

  it("switches to Biography view when selected", () => {
    render(
      <GalleryContext.Provider value={contextValue}>
        <Analyze />
      </GalleryContext.Provider>
    );

    fireEvent.change(screen.getByRole("combobox", { name: "View:" }), {
      target: { value: "biography" },
    });

    expect(mockFetchCenturyData).toHaveBeenCalledTimes(1);
    expect(screen.getByText("ArtistBiographyCards")).toBeInTheDocument();
  });
});
