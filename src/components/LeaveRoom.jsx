import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import {
  selectIsConnectedToRoom,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import {
  HangUpIcon,
  ExitIcon,
  AlertTriangleIcon,
} from "@100mslive/react-icons";
import {
  Button,
  Dialog,
  Tooltip,
  Box,
  IconButton,
  styled,
  Text,
  Flex,
  Dropdown,
} from "@100mslive/react-ui";
import {
  DialogCheckbox,
  DialogContent,
  DialogRow,
} from "../primitives/DialogContent";
import { useNavigation } from "./hooks/useNavigation";
import { isStreamingKit } from "../common/utils";

export const LeaveRoom = () => {
  const navigate = useNavigation();
  const params = useParams();
  const [showEndRoomModal, setShowEndRoomModal] = useState(false);
  const [lockRoom, setLockRoom] = useState(false);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const permissions = useHMSStore(selectPermissions);
  const hmsActions = useHMSActions();

  const redirectToLeavePage = () => {
    if (params.role) {
      navigate("/leave/" + params.roomId + "/" + params.role);
    } else {
      navigate("/leave/" + params.roomId);
    }
  };

  const leaveRoom = () => {
    hmsActions.leave();
    redirectToLeavePage();
  };

  const endRoom = () => {
    hmsActions.endRoom(lockRoom, "End Room");
    redirectToLeavePage();
  };

  const isStreamKit = isStreamingKit();
  if (!permissions || !isConnected) {
    return null;
  }

  return (
    <Fragment>
      {permissions.endRoom ? (
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <LeaveIconButton
              variant="danger"
              key="LeaveRoom"
              data-testid="leave_room_btn"
            >
              <Tooltip title="Leave Room">
                {!isStreamKit ? (
                  <Box>
                    <HangUpIcon key="hangUp" />
                  </Box>
                ) : (
                  <Flex gap={2}>
                    <Box css={{ "@md": { transform: "rotate(180deg)" } }}>
                      <ExitIcon key="hangUp" />
                    </Box>
                    <Text
                      css={{ "@md": { display: "none" }, color: "inherit" }}
                      variant="button"
                    >
                      Leave Studio
                    </Text>
                  </Flex>
                )}
              </Tooltip>
            </LeaveIconButton>
          </Dropdown.Trigger>
          <Dropdown.Content css={{ p: 0 }} alignOffset={-50} sideOffset={10}>
            <Dropdown.Item
              css={{ w: "100%", bg: "#34191C" }}
              onClick={() => {
                setShowEndRoomModal(true);
              }}
              data-testid="end_room_btn"
            >
              <Flex gap={4}>
                <Box>
                  <AlertTriangleIcon />
                </Box>
                <Flex direction="column" align="start">
                  <Text variant="h6" css={{ c: "$error" }}>
                    End Session
                  </Text>
                  <Text variant="sm" css={{ c: "$textMedEmp" }}>
                    The session will end for everyone. You can’t undo this
                    action.
                  </Text>
                </Flex>
              </Flex>
            </Dropdown.Item>
            <Dropdown.Item
              css={{ bg: "$surfaceDefault" }}
              onClick={leaveRoom}
              data-testid="just_leave_btn"
            >
              <Flex gap={4}>
                <Box>
                  <ExitIcon />
                </Box>
                <Flex direction="column" align="start">
                  <Text variant="h6">
                    Leave {isStreamKit ? "Studio" : "Room"}
                  </Text>
                  <Text variant="sm" css={{ c: "$textMedEmp" }}>
                    Others will continue after you leave. You can join the
                    {isStreamKit ? " studio" : " room"} again.
                  </Text>
                </Flex>
              </Flex>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      ) : (
        <LeaveIconButton onClick={leaveRoom} variant="danger" key="LeaveRoom">
          <Tooltip title="Leave Room">
            <Box>
              {isStreamKit ? (
                <Box css={{ "@md": { transform: "rotate(180deg)" } }}>
                  <ExitIcon />
                </Box>
              ) : (
                <HangUpIcon key="hangUp" />
              )}
            </Box>
          </Tooltip>
        </LeaveIconButton>
      )}

      <Dialog.Root
        open={showEndRoomModal}
        onOpenChange={value => {
          if (!value) {
            setLockRoom(false);
          }
          setShowEndRoomModal(value);
        }}
      >
        <DialogContent title="End Room" Icon={HangUpIcon}>
          <DialogCheckbox
            id="lockRoom"
            title="Disable future joins"
            value={lockRoom}
            onChange={setLockRoom}
          />
          <DialogRow justify="end">
            <Button
              variant="danger"
              onClick={endRoom}
              data-testid="lock_end_room"
            >
              End Room
            </Button>
          </DialogRow>
        </DialogContent>
      </Dialog.Root>
    </Fragment>
  );
};

const LeaveIconButton = styled(IconButton, {
  color: "$white",
  h: "$14",
  px: "$8",
  r: "$1",
  bg: "$error",
  "&:not([disabled]):hover": {
    bg: "$errorTint",
  },
  "&:not([disabled]):active": {
    bg: "$errorTint",
  },
  "@md": {
    px: "$4",
    mx: 0,
  },
});
