/* global ipcRenderer */
import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddBoxIcon from 'material-ui-icons/AddBox';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import grey from 'material-ui/colors/grey';
import Typography from 'material-ui/Typography';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import extractHostname from '../../tools/extractHostname';
import { open as openConfirmUninstallAppDialog } from '../../actions/dialogs/confirm-uninstall-app';
import { open as openAppDetailsDialog } from '../../actions/dialogs/app-details';

const styleSheet = createStyleSheet('Home', (theme) => {
  const cardContentDefaults = {
    position: 'relative',
    backgroundColor: grey[100],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return {
    scrollContainer: {
      flex: 1,
      padding: 36,
      overflow: 'auto',
      boxSizing: 'border-box',
    },

    cardHeader: {
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      width: '100%',
    },

    card: {
      width: 200,
      boxSizing: 'border-box',
    },

    cardIsViewing: {
      width: '90vw',
      padding: 0,
    },

    appName: {
      marginTop: 16,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },

    paperIcon: {
      width: 60,
      height: 'auto',
    },

    titleText: {
      fontWeight: 500,
      lineHeight: 1.5,
      marginTop: theme.spacing.unit,
    },
    cardContent: {
      ...cardContentDefaults,
    },

    cardContentIsViewing: {
      ...cardContentDefaults,
      backgroundColor: 'white',
      padding: 0,
    },

    domainText: {
      fontWeight: 400,
      lineHeight: 1,
      marginBottom: theme.spacing.unit,
    },
    cardActions: {
      justifyContent: 'center',
    },

    rightButton: {
      marginLeft: theme.spacing.unit,
    },
    iconButton: {
      margin: 0,
    },

    moreIconMenu: {
      position: 'absolute',
      transform: 'translate(82px, -16px)',
    },
    hiddenMenuItem: {
      display: 'none',
    },
  };
});

const AppCard = (props) => {
  const {
    app,
    classes,
    status,
    onOpenConfirmUninstallAppDialog,
    onOpenAppDetailsDialog,
  } = props;

  const handleOpenAppDetailsDialog = () => {
    const {
      name,
      url,
    } = props.app;

    onOpenAppDetailsDialog({ name, url });
  };

  const renderActions = () => {
    switch (status) {
      case 'INSTALLED': {
        return [
          <IconButton
            key="open"
            className={classes.iconButton}
            aria-label="Open"
            onClick={() => ipcRenderer.send('open-app', app.id, app.name)}
          >
            <ExitToAppIcon />
          </IconButton>,
          <IconButton
            key="uninstall"
            className={classes.iconButton}
            aria-label="Uninstall"
            onClick={() => onOpenConfirmUninstallAppDialog({ appName: app.name })}
          >
            <DeleteIcon />
          </IconButton>,
        ];
      }
      default: {
        return [
          <IconButton
            key="install"
            className={classes.iconButton}
            aria-label="Install"
            onClick={() => {}}
          >
            <AddBoxIcon />
          </IconButton>,
        ];
      }
    }
  };

  return (
    <Grid key={app.id} item>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <IconButton
            aria-label="More"
            color="primary"
            onClick={handleOpenAppDetailsDialog}
            className={classes.moreIconMenu}
          >
            <MoreVertIcon />
          </IconButton>
          <img src={`https://getwebcatalog.com/s3/${app.id}.webp`} alt="Messenger" className={classes.paperIcon} />
          <Typography type="subheading" className={classes.appName}>
            {app.name}
          </Typography>
          <Typography type="heading2" color="secondary">
            {extractHostname(app.url)}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          {renderActions()}
        </CardActions>
      </Card>
    </Grid>
  );
};

AppCard.defaultProps = {
};

AppCard.propTypes = {
  app: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  onOpenConfirmUninstallAppDialog: PropTypes.func.isRequired,
  onOpenAppDetailsDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { app } = ownProps;

  const status = state.core.managedApps[app.id] ? state.core.managedApps[app.id].status : 'NOT_INSTALLED';

  return { status };
};

const mapDispatchToProps = dispatch => ({
  onOpenConfirmUninstallAppDialog: form => dispatch(openConfirmUninstallAppDialog(form)),
  onOpenAppDetailsDialog: form => dispatch(openAppDetailsDialog(form)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(AppCard));
