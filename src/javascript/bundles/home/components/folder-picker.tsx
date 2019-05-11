import * as React from 'react';
import {Input} from "../../common/components/input";
import {Button} from "../../common/components/button";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {saveSetupLibraryPath} from "../utils/save-setup";

@observer
export class FolderPicker extends React.Component<{}> {
  @observable path = "";
  inputElement = React.createRef<HTMLInputElement>();

  private changePath(target: HTMLInputElement): void {
    this.path = target.files![0].path;
  }

  private returnInputTag(): React.ReactElement {
    // @ts-ignore
    return <input directory="" webkitdirectory=""
      type="file"
      ref={this.inputElement}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.changePath(event.target)}
      style={{ width: "0.1px", height: '0.1px', overflow: 'hidden' }} />;
  }

  private openFilePopup(): void {
    if(this.inputElement.current) {
      this.inputElement.current.click();
    }
  }

  private async savePath(): Promise<void> {
    await saveSetupLibraryPath(this.path);
  }

  render() {
    return (
      <React.Fragment>
        <Input
          fieldName="Library Location"
          onChange={() => {}}
          value={this.path}
          disabled
          placeholder="/path/to/anime/library"
          adornment={<Button size="small" onClick={(ev) => this.openFilePopup()}>Open Folder</Button>}
          helperText="We will use the location to help you find your anime episodes easily" />
        <Button className="next-button" size="large" color="primary" onClick={() => this.savePath()}>
          Next
        </Button>
        {this.returnInputTag()}
      </React.Fragment>
    );
  }
}