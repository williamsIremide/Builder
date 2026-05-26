import React from 'react';
import { useNode } from '@craftjs/core';
import { MapPin, Navigation } from 'lucide-react';

let useStorefront: any = null;
try {
  useStorefront = require('~/contexts').useStorefront;
} catch {}

export interface StoreLocationBlockProps {
  title?: string;
}

const PLACEHOLDER_BRANCHES = [
  { id: 1, location: { city: 'City A', street: '123 Main St', state_or_province: 'State', latitude: null, longitude: null } },
  { id: 2, location: { city: 'City B', street: '456 Side Ave', state_or_province: 'State', latitude: null, longitude: null } },
  { id: 3, location: { city: 'City C', street: '789 Park Rd', state_or_province: 'State', latitude: null, longitude: null } },
];

export const StoreLocationBlock = ({ title = 'Our Locations' }: StoreLocationBlockProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  let branches: any[] = [];
  try {
    if (useStorefront) {
      const { storefrontData } = useStorefront();
      // Use headquarter branch if available, otherwise empty
      const hq = storefrontData?.headquarter_branch;
      if (hq) branches = [hq];
    }
  } catch {}

  const items = branches.length > 0 ? branches : PLACEHOLDER_BRANCHES;
  const isPlaceholder = branches.length === 0;

  return (
    <section
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{ outline: selected ? '2px solid #f59e0b' : 'none', cursor: 'grab' }}
      className="w-full py-14 bg-muted/20"
    >
      <div className="container px-4 md:px-6 xl:px-10 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 ${isPlaceholder ? 'opacity-40' : ''}`}>
          {items.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-primary/40 transition-all duration-200 p-5 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {branch.location?.city ?? branch.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-tight">
                    {branch.location?.street}, {branch.location?.state_or_province}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Navigation className="w-4 h-4 text-orange-500" />
                  <span>Get directions</span>
                </div>
                {branch.location?.latitude && branch.location?.longitude && (
                  <button
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${branch.location.latitude},${branch.location.longitude}`,
                        '_blank'
                      );
                    }}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Directions
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StoreLocationBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as StoreLocationBlockProps,
  }));
  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Section Title</label>
        <input
          type="text"
          value={props.title ?? 'Our Locations'}
          onChange={(e) => setProp((p: StoreLocationBlockProps) => { p.title = e.target.value; })}
        />
      </div>
    </div>
  );
};

StoreLocationBlock.craft = {
  displayName: 'StoreLocationBlock',
  props: { title: 'Our Locations' },
  related: { settings: StoreLocationBlockSettings },
};