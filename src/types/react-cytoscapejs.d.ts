declare module 'react-cytoscapejs' {
  import { Component } from 'react';
  import cytoscape from 'cytoscape';

  // Extend the StylesheetCSS type to include style property
  interface StylesheetCSS {
    selector: string;
    style: Record<string, any>;
  }

  interface CytoscapeComponentProps {
    elements: cytoscape.ElementDefinition[];
    stylesheet?: StylesheetCSS[];
    style?: React.CSSProperties;
    cy?: (cy: cytoscape.Core) => void;
    layout?: cytoscape.LayoutOptions;
    className?: string;
    zoom?: number;
    pan?: { x: number; y: number };
    minZoom?: number;
    maxZoom?: number;
    zoomingEnabled?: boolean;
    userZoomingEnabled?: boolean;
    panningEnabled?: boolean;
    userPanningEnabled?: boolean;
    boxSelectionEnabled?: boolean;
    autoungrabify?: boolean;
    autounselectify?: boolean;
    autolock?: boolean;
    autoRefreshLayout?: boolean;
    headless?: boolean;
    styleEnabled?: boolean;
    hideEdgesOnViewport?: boolean;
    hideLabelsOnViewport?: boolean;
    textureOnViewport?: boolean;
    motionBlur?: boolean;
    motionBlurOpacity?: number;
    wheelSensitivity?: number;
    pixelRatio?: number | 'auto';
  }

  class CytoscapeComponent extends Component<CytoscapeComponentProps> {}

  export default CytoscapeComponent;
}
