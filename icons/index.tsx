import React from 'react';
import Image, { StaticImageData } from "next/image"; 

const ICON_CLASS: string = "transition-all duration-200 text-gray-600 opacity-80 dark:invert dark:opacity-70";

interface IconProps {
  width?: number;
  height?: number;
  className?: string
}


const createIconComponent = (IconPath: StaticImageData, name: string): React.FC<IconProps> => {
  return ({ width = 25, height = 25, className = "" }) => (
    <Image 
      src={IconPath} 
      alt={name} 
      width={width} 
      height={height} 
      className={`${ICON_CLASS} ${className}`} 
    />
  );
};

import PlusIconPath from "./plus.svg";
import CloseIconPath from "./close.svg";
import BoxIconPath from "./box.svg";
import CheckCircleIconPath from "./check-circle.svg";
import AlertIconPath from "./alert.svg";
import InfoIconPath from "./info.svg";
import ErrorIconPath from "./info-hexa.svg";
import BoltIconPath from "./bolt.svg";
import ArrowUpIconPath from "./arrow-up.svg";
import ArrowDownIconPath from "./arrow-down.svg";
import FolderIconPath from "./folder.svg";
import VideoIconPath from "./videos.svg";
import AudioIconPath from "./audio.svg";
import GridIconPath from "./grid.svg";
import FileIconPath from "./file.svg";
import DownloadIconPath from "./download.svg";
import ArrowRightIconPath from "./arrow-right.svg";
import GroupIconPath from "./group.svg";
import BoxIconLinePath from "./box-line.svg";
import ShootingStarIconPath from "./shooting-star.svg";
import DollarLineIconPath from "./dollar-line.svg";
import TrashBinIconPath from "./trash.svg";
import AngleUpIconPath from "./angle-up.svg";
import AngleDownIconPath from "./angle-down.svg";
import PencilIconPath from "./pencil.svg";
import CheckLineIconPath from "./check-line.svg";
import CloseLineIconPath from "./close-line.svg";
import ChevronDownIconPath from "./chevron-down.svg";
import ChevronUpIconPath from "./chevron-up.svg";
import PaperPlaneIconPath from "./paper-plane.svg";
import LockIconPath from "./lock.svg";
import EnvelopeIconPath from "./envelope.svg";
import UserIconPath from "./user-line.svg" ;
import CalenderIconPath from "./calender-line.svg";
import EyeIconPath from "./eye.svg";
import EyeCloseIconPath from "./eye-close.svg";
import TimeIconPath from "./time.svg";
import CopyIconPath from "./copy.svg";
import ChevronLeftIconPath from "./chevron-left.svg";
import UserCircleIconPath from "./user-circle.svg";
import TaskIconPath from "./task-icon.svg";
import ListIconPath from "./list.svg";
import TableIconPath from "./table.svg" ;
import PageIconPath from "./page.svg";
import PieChartIconPath from "./pie-chart.svg";
import BoxCubeIconPath from "./box-cube.svg";
import PlugInIconPath from "./plug-in.svg";
import DocsIconPath from "./docs.svg";
import MailIconPath from "./mail-line.svg";
import HorizontaLDotsPath from "./horizontal-dots.svg";
import ChatIconPath from "./chat.svg";
import MoreDotIconPath from "./more-dot.svg";
import BellIconPath from "./bell.svg";
import ProductsIconPath from "./products.svg";
import CategoriesIconPath from "./categories.svg";
import DashboardIconPath from "./dashboard.svg";
import GlobeIconPath from "./globe.svg";
import LoadingIconPath from "./loading.svg";
import phoneIconPath from "./phone.svg";
import AddressIconPath from "./address.svg";
import WhatsappIconPath from "./whatsapp.svg";
import logoutIconPath from "./logout.svg";
import supportIconPath from "./support.svg";

export const PlusIcon = createIconComponent(PlusIconPath, "Plus");
export const CloseIcon = createIconComponent(CloseIconPath, "Close");
export const BoxIcon = createIconComponent(BoxIconPath, "Box");
export const CheckCircleIcon = createIconComponent(CheckCircleIconPath, "Check Circle");
export const AlertIcon = createIconComponent(AlertIconPath, "Alert");
export const InfoIcon = createIconComponent(InfoIconPath, "Info");
export const ErrorIcon = createIconComponent(ErrorIconPath, "Error");
export const BoltIcon = createIconComponent(BoltIconPath, "Bolt");
export const ArrowUpIcon = createIconComponent(ArrowUpIconPath, "Arrow Up");
export const ArrowDownIcon = createIconComponent(ArrowDownIconPath, "Arrow Down");
export const FolderIcon = createIconComponent(FolderIconPath, "Folder");
export const VideoIcon = createIconComponent(VideoIconPath, "Video");
export const AudioIcon = createIconComponent(AudioIconPath, "Audio");
export const GridIcon = createIconComponent(GridIconPath, "Grid");
export const FileIcon = createIconComponent(FileIconPath, "File");
export const DownloadIcon = createIconComponent(DownloadIconPath, "Download");
export const ArrowRightIcon = createIconComponent(ArrowRightIconPath, "Arrow Right");
export const GroupIcon = createIconComponent(GroupIconPath, "Group");
export const BoxIconLine = createIconComponent(BoxIconLinePath, "Box Line");
export const ShootingStarIcon = createIconComponent(ShootingStarIconPath, "Shooting Star");
export const DollarLineIcon = createIconComponent(DollarLineIconPath, "Dollar Line");
export const TrashBinIcon = createIconComponent(TrashBinIconPath, "Trash Bin");
export const AngleUpIcon = createIconComponent(AngleUpIconPath, "Angle Up");
export const AngleDownIcon = createIconComponent(AngleDownIconPath, "Angle Down");
export const PencilIcon = createIconComponent(PencilIconPath, "Pencil");
export const CheckLineIcon = createIconComponent(CheckLineIconPath, "Check Line");
export const CloseLineIcon = createIconComponent(CloseLineIconPath, "Close Line");
export const ChevronDownIcon = createIconComponent(ChevronDownIconPath, "Chevron Down");
export const ChevronUpIcon = createIconComponent(ChevronUpIconPath, "Chevron Up");
export const PaperPlaneIcon = createIconComponent(PaperPlaneIconPath, "Paper Plane");
export const LockIcon = createIconComponent(LockIconPath, "Lock");
export const EnvelopeIcon = createIconComponent(EnvelopeIconPath, "Envelope");
export const UserIcon = createIconComponent(UserIconPath, "User");
export const CalenderIcon = createIconComponent(CalenderIconPath, "Calendar");
export const EyeIcon = createIconComponent(EyeIconPath, "Eye");
export const EyeCloseIcon = createIconComponent(EyeCloseIconPath, "Eye Close");
export const TimeIcon = createIconComponent(TimeIconPath, "Time");
export const CopyIcon = createIconComponent(CopyIconPath, "Copy");
export const ChevronLeftIcon = createIconComponent(ChevronLeftIconPath, "Chevron Left");
export const UserCircleIcon = createIconComponent(UserCircleIconPath, "User Circle");
export const TaskIcon = createIconComponent(TaskIconPath, "Task");
export const ListIcon = createIconComponent(ListIconPath, "List");
export const TableIcon = createIconComponent(TableIconPath, "Table");
export const PageIcon = createIconComponent(PageIconPath, "Page");
export const PieChartIcon = createIconComponent(PieChartIconPath, "Pie Chart");
export const BoxCubeIcon = createIconComponent(BoxCubeIconPath, "Box Cube");
export const PlugInIcon = createIconComponent(PlugInIconPath, "Plug In");
export const DocsIcon = createIconComponent(DocsIconPath, "Docs");
export const MailIcon = createIconComponent(MailIconPath, "Mail");
export const HorizontaLDots = createIconComponent(HorizontaLDotsPath, "Horizontal Dots");
export const ChatIcon = createIconComponent(ChatIconPath, "Chat");
export const MoreDotIcon = createIconComponent(MoreDotIconPath, "More Dot");
export const BellIcon = createIconComponent(BellIconPath, "Bell");
export const ProductsIcon = createIconComponent(ProductsIconPath, "Products");
export const CategoriesIcon = createIconComponent(CategoriesIconPath, "Categories");
export const DashboardIcon = createIconComponent(DashboardIconPath, "Dashboard");
export const LanguageIcon = createIconComponent(GlobeIconPath, "Language");
export const LoadingIcon = createIconComponent(LoadingIconPath, "Loading");
export const PhoneIcon = createIconComponent(phoneIconPath, "Phone");
export const AddressIcon = createIconComponent(AddressIconPath, "Address");
export const WhatsappIcon = createIconComponent(WhatsappIconPath, "Whatsapp");
export const LogoutIcon = createIconComponent(logoutIconPath, "logout");
export const SupportIcon = createIconComponent(supportIconPath, "support");