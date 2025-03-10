import { ModeToggle } from "../dashboard/dark-mode";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "../ui/breadcrumb";

const TopBar = () => {
  return (
    <div className="border-b p-4 border-muted">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/focus">
                  <h1 className="px-2 py-1 rounded bg-muted text-sm font-semibold">
                    Focus Room
                  </h1>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ModeToggle />
      </div>
    </div>
  );
};

export default TopBar;
