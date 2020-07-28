import { useState, useEffect } from 'react';
import { compareDesc } from 'date-fns';
import { useOvermind } from 'app/overmind';
import { DashboardGridItem } from 'app/pages/NewDashboard/types';

type Params = {
  path?: string;
};

export const useFilteredItems = (params: Params) => {
  const param = params.path || '';
  const {
    state: {
      dashboard: {
        getFilteredSandboxes,
        sandboxes,
        filters,
        orderBy: sandboxesOrder,
      },
    },
  } = useOvermind();
  const [items, setItems] = useState<Array<DashboardGridItem>>([]);
  const sandboxesForPath =
    sandboxes.REPOS && param
      ? getFilteredSandboxes(sandboxes.REPOS[param].sandboxes || [])
      : [];

  const repos = (sandboxes.REPOS && Object.values(sandboxes.REPOS)) || [];

  useEffect(() => {
    if (param) {
      setItems(
        sandboxesForPath.map(sandbox => ({
          type: 'sandbox' as 'sandbox',
          noDrag: true,
          sandbox,
        }))
      );
    } else {
      setItems(
        repos
          .sort((a, b) => compareDesc(a.lastEdited, b.lastEdited))
          .map(repo => ({
            type: 'repo' as 'repo',
            noDrag: true,
            ...repo,
          }))
      );
    }

    // eslint-disable-next-line
  }, [
    sandboxes.REPOS,
    param,
    params,
    filters.blacklistedTemplates,
    getFilteredSandboxes,
    sandboxesOrder,
  ]);

  return items;
};
