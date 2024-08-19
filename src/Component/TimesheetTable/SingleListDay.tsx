import CalenderType1 from "@/Assets/Icons/CalenderType1";
import PDFType1 from "@/Assets/Icons/PDFType1";
import { TimeSheetDataDay } from "@/Pages/TimeSheetsView";
import {
  fetchDeleteTimeSheets,
  fetchGetTimeSheetsDay,
} from "@/redux/reducers/timeSheetsSlicer";
import { fetchGetMediaUploaded } from "@/redux/reducers/userBGVSlicer";
import { AppDispatch, RootState } from "@/redux/store";
import { Button, Checkbox, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { TbTrash } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import NewTimeSheetModal from "../TimeSheets/NewTimeSheetModal";
import DocumentsPreviewModal from "./DocumentsPreviewModal";
import { convertUTCToLocalTime } from "@/utils/utcToLocalTime";
interface SingleListProps {
  data: TimeSheetDataDay;
  type: string;
  id?: number;
  week?: string | number;
}

const SingleListDay: React.FC<SingleListProps> = ({
  type = "day",
  data,
  id,
  week,
}: SingleListProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedM, { open: openM, close: closeM }] = useDisclosure(false);
  const dispatch: AppDispatch = useDispatch();
  const [ids, setIds] = useState<string[]>([]);
  const { token } = useSelector((state: RootState) => state.userReducer);
  const { filesMediaData }: { filesMediaData: any } = useSelector(
    (state: RootState) => state.userBgvReducer
  );
  const [selectedData, setSelectedData] = useState<TimeSheetDataDay>();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const host = window.location.host;
  const subdomain = host.split(".")[0];
  const portalUrl = `${subdomain}.saciahub.com`;

  const fetchFile = (file: string) => {
    open();
    dispatch(
      fetchGetMediaUploaded({
        portalUrl,
        file,
        token: token || "",
      })
    );

    const extension = file.split(".").pop()?.toLowerCase();
    let mimeType = "";

    switch (extension) {
      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg";
        break;
      case "png":
        mimeType = "image/png";
        break;
      case "gif":
        mimeType = "image/gif";
        break;
      // Add other cases as needed
      default:
        mimeType = "";
    }

    if (mimeType) {
      setFileType(mimeType);
    }
  };

  useEffect(() => {
    if (filesMediaData && filesMediaData instanceof Blob) {
      const url = URL.createObjectURL(filesMediaData);
      setFileUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [filesMediaData]);

  useEffect(() => {
    if (data) {
      if (id) {
        const idAsStringArray: string[] = [id.toString()];
        setIds(idAsStringArray);
      }
    }
  }, [data]);
  return (
    <div className="flex items-center py-3 bg-white mt-2 rounded-md">
      <div className="w-[5%] flex justify-start ml-4">
        <Checkbox color="black" className="!cursor-pointer" />
      </div>
      <div className="w-[10%] text-center text-sm font-semibold flex items-center justify-center">
        {data?.ProjectName}
      </div>
      {type === "day" ? (
        <div className="flex gap-2 items-center w-[30%] justify-center text-sm font-semibold">
          <CalenderType1 />
          <p>{convertUTCToLocalTime(data?.Date)}</p>
        </div>
      ) : type === "month" ? (
        <>
          <div className="flex gap-2 items-center w-[15%] justify-center text-sm font-semibold">
            <CalenderType1 />
            <p>1 Jul, 2024</p>
          </div>
          <div className="flex gap-2 items-center w-[15%] justify-center text-sm font-semibold">
            <CalenderType1 />
            <p>31 Jul, 2024</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2 items-center w-[15%] justify-center text-sm font-semibold">
            <CalenderType1 />
            <p>20 Jul, 2024</p>
          </div>
          <div className="flex gap-2 items-center w-[15%] justify-center text-sm font-semibold">
            <CalenderType1 />
            <p>26 Jul, 2024</p>
          </div>
        </>
      )}
      <div className="w-[10%] text-center text-sm font-semibold flex items-center justify-center">
        {data?.ProjectBucket}
      </div>

      <div className="w-[10%] flex justify-center">
        <div
          className="flex gap-1 items-center justify-center border-gray-300 border-2 rounded-lg px-1 cursor-pointer"
          onClick={() => {
            fetchFile(data?.TimesheetAttachmentURL);
          }}
        >
          <PDFType1 />
          <span className="text-gray-500">
            {data?.TimesheetAttachmentURL.slice(0, 5)}...
            {data?.TimesheetAttachmentURL.split(".")[1]}
          </span>
        </div>

        <Modal
          opened={opened}
          onClose={close}
          withCloseButton={false}
          size=""
          centered
        >
          <DocumentsPreviewModal
            close={close}
            alt=""
            file={fileUrl}
            type={fileType}
          />
        </Modal>
      </div>
      <div className="w-[10%] text-center text-sm font-semibold flex items-center justify-center">
        {data?.HoursWorked}
      </div>
      <div className="w-[7.5%] text-center">
        {data?.Status === "Pending" ? (
          <Button
            type="button"
            className="text-sm"
            radius="xl"
            color="rgba(242, 178, 2, 0.44)"
            style={{ color: "black" }}
          >
            Pending
          </Button>
        ) : data?.Status === "Approved" ? (
          <Button
            type="button"
            className="text-sm"
            radius="xl"
            color="rgba(0, 255, 49, 0.44)"
            style={{ color: "black" }}
          >
            Approved
          </Button>
        ) : (
          <Button
            type="button"
            className="text-sm"
            radius={"md"}
            color="#C20025"
            style={{ color: "white" }}
          >
            Decline
          </Button>
        )}
      </div>
      <div className="w-[7.5%] text-center">Not Available</div>
      <div className="w-[10%] text-center flex items-center justify-center">
        <Menu shadow="md">
          <Menu.Target>
            <Button
              type="button"
              className="text-sm"
              size="xs"
              style={{
                backgroundColor: "white",
                color: "black",
              }}
            >
              <BsThreeDots />
            </Button>
          </Menu.Target>
          <Menu.Dropdown
            style={{
              width: "100px",
            }}
          >
            {data?.Status == "Pending" ? (
              <Menu.Item
                leftSection={<BiEdit />}
                onClick={() => {
                  openM();
                }}
              >
                Edit
              </Menu.Item>
            ) : (
              <Menu.Item leftSection={<BiEdit />} className="bg-gray-400">
                Edit
              </Menu.Item>
            )}
            <Menu.Item
              leftSection={<TbTrash color="red" />}
              onClick={() => {
                dispatch(
                  fetchDeleteTimeSheets({
                    portalUrl,
                    token,
                    timesheetID: ids,
                  })
                ).then(() => {
                  notifications.show({
                    color: "blue",
                    title: "Success",
                    message: "Timesheet deleted successfully",
                    autoClose: 4000,
                  });
                  dispatch(
                    fetchGetTimeSheetsDay({
                      portalUrl,
                      month: week,
                      token: token as any,
                    }) as any
                  );
                });
              }}
            >
              <span className="text-red-500">Delete</span>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <Modal
        opened={openedM}
        onClose={closeM}
        withCloseButton={false}
        size="auto"
        centered
      >
        <NewTimeSheetModal close={closeM} type="single" data={selectedData} />
      </Modal>
    </div>
  );
};

export default SingleListDay;
