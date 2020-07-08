this.state = {
    bioEditorIsVisible: true,
    //draftBio keeps tracj of whatever the user types (change eventHandler )
    draftBio: "",
};

if (this.state.bioEditorIsVisible) {
    return (
        <div>
            <h1>I am bio editor</h1>
            <textarea />
        </div>
    );
} else {
    // if bioEditorIsVisible is false  -text area should be hidden
    // this check in here here should determine what the text should say
    // if there biobio, allow them to edit
    // if there is no bio, allow them to add
    // whenever they click on either (add or edit), show the text area
}

this.props.setBio(newBio);
